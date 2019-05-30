const page = location.search.includes("page") ? location.search.split("page")[1][1] : 1;
const url_string = location.search.split("&page="+page)[0].replace("?", "");
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

window.onload = async function () {
    $('#page-selection').bootpag({
        total: Math.ceil(parseInt(page_num)/5),
        page: page
    }).on("page", function(event, num){
        window.location = "/member/search?"+url_string+"&page="+num.toString();
    });
};

$("#btn_member").on("click", function(event){
    let check = false;
    $(".checkbox_member").each(function(index, obj){
        if(this.checked){
            if(query === "ap"){
                window.opener.ap_searched = true;
                window.opener.member_id = this.id;
                window.opener.document.getElementById('ap_name').value = $("#name_"+this.id.toString()).text();
                window.opener.document.getElementById('ap_name').disabled = true;
            }
            window.close();
            check = true;
        }
    });
    if(check)
        return false;
    else{
        alert("회원을 선택해 주세요");
        return false;
    }
});

$(".flat").on("ifClicked", async function(event){
    id = this.id;
    $("#ap_tbody").empty();

    const member_data = await getMemberInfo(id);
    member_data.forEach(function(item, counter){
        const blacklist = item.ap_blacklist ? "<a class='glow'>병신임ㅋ</a>" : "일반 손님";
        const date = new Date(item.ap_date);
        if(counter%2===0){
            $("#ap_tbody").append('<tr class="odd pointer">' +
                '<td class=" ">'+(counter+1)+'</td>' +
                '<td class=" ">'+item.ap_member_name+'</td>' +
                '<td class=" ">'+item.ap_member_phone+'</td>' +
                '<td class=" ">'+item.ap_procedure_name+'</td>' +
                '<td class=" ">'+blacklist+'</td>' +
                '<td class="a-right a-right ">'+date.getFullYear()+'년 '+(date.getMonth()+1).toString()+'월 '+ date.getDate()+'일 '+date.getHours()+'시 '+date.getMinutes()+'분 '+'</td>' +
                '<td class=" "><a target="_blank" href="/appointment/'+item.ap_id+'?query=search">조회</a>')
        } else{
            $("#ap_tbody").append('<tr class="even pointer">' +
                '<td class=" ">'+(counter+1)+'</td>' +
                '<td class=" ">'+item.ap_member_name+'</td>' +
                '<td class=" ">'+item.ap_member_phone+'</td>' +
                '<td class=" ">'+item.ap_procedure_name+'</td>' +
                '<td class=" ">'+blacklist+'</td>' +
                '<td class="a-right a-right ">'+date.getFullYear()+'년 '+(date.getMonth()+1).toString()+'월 '+ date.getDate()+'일 '+date.getHours()+'시 '+date.getMinutes()+'분 '+'</td>' +
                '<td class=" "><a target="_blank" href="/appointment/'+item.ap_id+'?query=search">조회</a>')
        }
    })
})