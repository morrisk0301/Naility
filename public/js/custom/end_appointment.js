const host = location.host;
const page = location.search.split("=")[1];
let blacklist = false;
let rawDate;
let date;

function getMemberNum(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/appoint_unfinished_num')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

window.onload = async function () {
    const memberNum = await getMemberNum();
    $('#page-selection').bootpag({
        total: Math.ceil(memberNum/5),
        page: page
    }).on("page", function(event, num){
        window.location = "/end_appointment?page="+num.toString();
    })
};

$("#btn_search_procedure").on("click", function(event){
    window.open("/procedure/search?name="+$("#ap_procedure").val(), "시술 추가", "width=500,height=600");
    return false;
})

$(".checkbox_appointment.flat").on("ifClicked", function(event){
    const id = this.id;
    $.ajax({
        url: '/appointment/'+id,
        type: 'GET',
        success: function (data) {
            rawDate = new Date(data.ap.ap_date);
            date = rawDate.getFullYear() + '년 '+ (rawDate.getMonth() + 1).toString() + '월 ' + rawDate.getDate() + '일 ' + rawDate.getHours() + '시 ' + rawDate.getMinutes() + '분 ';
            window.procedure = data.ap.ap_procedure_name;
            $("#name").val(data.ap.ap_member_name);
            $("#ap_procedure").val(data.ap.ap_procedure_name);
            $("#date").val(date);
            $("#ap_price").val(data.ap.ap_price);
            $("#ap_id").val(id);
        }
    });
})

$("#btn_appointment").on('click', function(event){
    if(!$("#name").val()){
        alert("회원을 선택해 주세요")
        return false;
    }
    else if(!window.procedure){
        alert("시술을 선택해 주세요")
        return false;
    }else if(!$("#real_price").val()){
        alert("실제 가격을 입력해 주세요")
        return false;
    }
    let query = {
        'date': $("#date").val()!==date ? $("#date").val() : rawDate,
        'procedure': JSON.stringify(window.procedure),
        'price': $("#ap_price").val(),
        'real_price': $("#real_price").val(),
        'method': $("#method").val(),
        'detail': $("#detail").val(),
        'blacklist': blacklist
    }
    if(confirm("마감 하시겠습니까?")){
        $.ajax({
            url: '/appointment/'+$("#ap_id").val(),
            type: 'PUT',
            data: query,
            success: function (data) {
                document.write(data);
            }
        });
    }
    return false;
})

$("#btn_appointment_delete").on('click', function(event){
    if(!$("#name").val()){
        alert("회원을 선택해 주세요")
        return false;
    }
    $("#real_price").val(0);

    let query = {
        'date': rawDate,
        'procedure': JSON.stringify("예약 취소"),
        'price': 0,
        'real_price': 0,
        'method': "예약 취소",
        'detail': "노쇼 회원입니다.",
        'blacklist': true
    }
    if(confirm("마감 하시겠습니까?")){
        $.ajax({
            url: '/appointment/'+$("#ap_id").val(),
            type: 'PUT',
            data: query,
            success: function (data) {
                document.write(data);
            }
        });
    }
    return false;
})

$("#blacklist").on("ifChanged", function(event){
    blacklist = event.target.checked;
})

$(function () {
    $('#datetimepicker').datetimepicker();
});