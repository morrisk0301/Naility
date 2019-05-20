const page = location.search.includes("page") ? location.search.split("page")[1][1] : 1;
const url_string = location.search.split("&page="+page)[0].replace("?", "");

window.onload = async function () {
    $('#page-selection').bootpag({
        total: Math.ceil(parseInt(page_num)/15),
        page: page
    }).on("page", function(event, num){
        window.location = "/procedure/search?"+url_string+"&page="+num.toString();
    });
};

$("#btn_procedure").on("click", function(event){
    let check = false;
    let name = "";
    let id_array = [];
    let price = 0;

    $(".checkbox_procedure").each(function(index, obj){
        if(this.checked){
            id_array.push(this.id);
            name = name + $("#name_"+this.id.toString()).text()+" ";
            price += parseInt($("#price_"+this.id.toString()).text());
        }
        check = true;
    })
    if(!check){
        alert("회원을 선택해 주세요");
        return false;
    }

    window.opener.procedure = id_array;
    window.opener.pd_searched = true;
    window.opener.document.getElementById('ap_procedure').value = name;
    window.opener.document.getElementById('ap_price').value = price;
    window.opener.document.getElementById('ap_procedure').disabled = true;
    window.close();
    return false;
})