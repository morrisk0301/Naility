const host = location.host;
let id;

function getMemberInfo(id){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/appointment_member/'+id)
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function saveByteArray(fileName, byte) {
    const blob = new Blob([byte], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

window.onload = async function () {
    console.log(page);
    $('#page-selection').bootpag({
        total: Math.ceil(parseInt(page_num)/5),
        page: page,
        maxVisible: 10
    }).on("page", function(event, num){
        window.location = "/member?"+url_string+"&page="+num.toString();
    });
};

$("#btn_member").on("click", function(event){
    window.open("/add_member?ap=false", "회원 추가", "width=500,height=600");
});


$("#search_text").keypress(function(e) {
    if (e.keyCode == 13){
        const query = $("#search_query").val() === "이름" ? "name" : "phone";
        window.location = "/member?search="+$("#search_text").val()+"&query="+ query;
    }
});


$("#btn_search").on("click", function(event){
    window.location = "/member?search="+$("#search_text").val()
});

$(".flat").on("ifClicked", async function(event){
    id = this.id;
    $("#ap_tbody").empty();

    const member_data = await getMemberInfo(id);
    member_data.forEach(function(item, counter){
        const blacklist = item.ap_blacklist ? "<a class='glow'>관심 손님</a>" : "일반 손님";
        const date = new Date(item.ap_date);
        if(counter%2===0){
            $("#ap_tbody").append('<tr class="odd pointer">' +
                '<td class=" ">'+(counter+1)+'</td>' +
                '<td class=" ">'+item.member_data[0].member_name+'</td>' +
                '<td class=" ">'+item.member_data[0].member_phone+'</td>' +
                '<td class=" ">'+item.ap_procedure_name+'</td>' +
                '<td class=" ">'+blacklist+'</td>' +
                '<td class="a-right a-right ">'+date.getFullYear()+'년 '+(date.getMonth()+1).toString()+'월 '+ date.getDate()+'일 '+date.getHours()+'시 '+date.getMinutes()+'분 '+'</td>' +
                '<td class=" "><a target="_blank" class="btn btn-dark"  href="/appointment/'+item.ap_id+'?query=search">조회</a>')
        } else{
            $("#ap_tbody").append('<tr class="even pointer">' +
                '<td class=" ">'+(counter+1)+'</td>' +
                '<td class=" ">'+item.member_data[0].member_name+'</td>' +
                '<td class=" ">'+item.member_data[0].member_phone+'</td>' +
                '<td class=" ">'+item.ap_procedure_name+'</td>' +
                '<td class=" ">'+blacklist+'</td>' +
                '<td class="a-right a-right ">'+date.getFullYear()+'년 '+(date.getMonth()+1).toString()+'월 '+ date.getDate()+'일 '+date.getHours()+'시 '+date.getMinutes()+'분 '+'</td>' +
                '<td class=" "><a target="_blank" class="btn btn-dark" href="/appointment/'+item.ap_id+'?query=search">조회</a>')
        }
    })
});

$("#btn_member_modify").on('click', function(event){
    let check = false;
    $(".checkbox_member").each(function(index, obj){
        if(this.checked){
            console.log(alert);
            check = true;
            window.open("/member/"+id, "회원 수정", "width=500,height=600");
            return false;
        }
    });
    if(!check)
        alert("회원을 선택해주세요");
});

$("#btn_excel").on("click", async function(event){
    $.ajax({
        url: '/member/excel',
        type: 'GET',
        success: function (data) {
            const filename = moment().format('YYYY_MM_DD') + '_회원조회.xlsx';
            saveByteArray(filename, Buffer.Buffer.from(data));
        }
    });
    return false;
});