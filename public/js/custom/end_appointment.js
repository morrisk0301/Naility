const host = location.host;
const page = location.search.split("=")[1];
let blacklist = false;

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
});

$(".checkbox_appointment.flat").on("ifClicked", function(event){
    const id = this.id;
    $.ajax({
        url: '/appointment/'+id,
        type: 'GET',
        success: function (data) {
            const rawDate = new Date(data.ap.ap_date);
            const rawDate_end = new Date(data.ap.ap_date_end);
            const ampm = parseInt(rawDate.getHours()/12) === 0 ? 'AM' : 'PM';
            const ampm_end = parseInt(rawDate_end.getHours()/12) === 0 ? 'AM' : 'PM';
            const date = ("0" + (rawDate.getMonth() + 1)).slice(-2) + '/' + ("0" +
                rawDate.getDate()).slice(-2)+'/'+rawDate.getFullYear()+' '+(rawDate.getHours()%12) + ":"+
                ("0" + rawDate.getMinutes()).slice(-2) + ' ' + ampm;
            const date_end = ("0" + (rawDate_end.getMonth() + 1)).slice(-2) + '/' + ("0" +
                rawDate_end.getDate()).slice(-2)+'/'+rawDate_end.getFullYear()+' '+(rawDate_end.getHours()%12) + ":"+
                ("0" + rawDate_end.getMinutes()).slice(-2) + ' ' + ampm_end;

            window.procedure = data.ap.ap_procedure_name;
            $("#name").text(data.ap.ap_member_name);
            $("#ap_procedure").val(data.ap.ap_procedure_name);
            $("#date").text(date);
            $("#date_end").text(date_end);
            $("#ap_price").text(data.ap.ap_price);
            $("#ap_id").val(id);
        }
    });
});

$("#btn_appointment").on('click', function(event){
    if($("#name").text()===""){
        alert("회원을 선택해 주세요");
        return false;
    }
    else if(!window.procedure){
        alert("시술을 선택해 주세요");
        return false;
    }else if(!$("#real_price").val()){
        alert("실제 가격을 입력해 주세요");
        return false;
    }
    let query = {
        'procedure': JSON.stringify(window.procedure),
        'price': $("#ap_price").text(),
        'real_price': $("#real_price").val(),
        'method': $("#method").val(),
        'detail': $("#detail").val(),
        'blacklist': blacklist
    };
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
    if($("#name").text()===""){
        alert("회원을 선택해 주세요");
        return false;
    }
    $("#real_price").val(0);

    let query = {
        'procedure': JSON.stringify(window.procedure),
        'price': $("#ap_price").text(),
        'real_price': 0,
        'method': "예약 취소",
        'detail': "노쇼 회원입니다.",
        'blacklist': true
    };
    if(confirm("취소 하시겠습니까?")){
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
});

$("#blacklist").on("ifChanged", function(event){
    blacklist = event.target.checked;
});
