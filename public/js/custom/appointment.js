const host = location.host;
const page = location.search.includes("page") ? location.search.split("page")[1][1] : 1;
const url_string = location.search.split("&page="+page)[0].replace("?", "");
let id;

function getMemberNum(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/appointment_num')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

window.onload = async function () {
    const memberNum = await getMemberNum();
    $('#page-selection').bootpag({
        total: Math.ceil(memberNum/15),
        page: page
    }).on("page", function(event, num){
        window.location = "/appointment?"+url_string+"&page="+num.toString();
    });
};


$("#btn_search").on("click", function(event){
    const query = $("#search_query").val() === "회원 이름" ? "name" : "phone"
    window.location = "/appointment?search="+$("#search_text").val()+"&query="+ query;
})

$(".checkbox_appointment, .flat").on("ifChanged", function(event){
    id = this.id
})

$("#btn_view").on("click", function(event){
    let check = false;
    $(".checkbox_appointment").each(function(index, obj){
        if(this.checked){
            check = true;
            window.open("/appointment/"+id+"?query=modify", "예약 조회", "width=500,height=600");
            return false;
        }
    })
    if(!check)
        alert("예약을 선택해주세요");
})