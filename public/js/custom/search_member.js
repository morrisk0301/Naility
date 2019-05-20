const page = location.search.includes("page") ? location.search.split("page")[1][1] : 1;
const url_string = location.search.split("&page="+page)[0].replace("?", "");

window.onload = async function () {
    $('#page-selection').bootpag({
        total: Math.ceil(parseInt(page_num)/15),
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
            else if(query === "membership_add"){
                window.opener.add_searched = true;
                window.opener.add_member_id = this.id;
                window.opener.document.getElementById('add_name').value = $("#name_"+this.id.toString()).text();
                window.opener.document.getElementById('add_name').disabled = true;
            }
            else if(query === "membership_give"){
                window.opener.give_searched = true;
                window.opener.give_member_id = this.id;
                window.opener.document.getElementById('give_name').value = $("#name_"+this.id.toString()).text();
                window.opener.document.getElementById('give_name').disabled = true;
            }
            else if(query === "membership_get"){
                window.opener.get_searched = true;
                window.opener.get_member_id = this.id;
                window.opener.document.getElementById('get_name').value = $("#name_"+this.id.toString()).text();
                window.opener.document.getElementById('get_name').disabled = true;
            }
            else if(query === "membership_refund"){
                window.opener.refund_searched = true;
                window.opener.refund_member_id = this.id;
                window.opener.document.getElementById('refund_name').value = $("#name_"+this.id.toString()).text();
                window.opener.document.getElementById('refund_name').disabled = true;
            }
            window.close();
            check = true;
        }
    })
    if(check)
        return false;
    else{
        alert("회원을 선택해 주세요");
        return false;
    }
})