const member_id = location.pathname.split('/')[2];
const contact_arr = ["전화", "문자", "카카오톡", "인스타그램", "페이스북", "로드", "지인", "기타"];


function checkPhone(phone){
    const regExp = /^\d{3}-\d{3,4}-\d{4}$/;

    if (!regExp.test(phone.val())){
        if(phone.val().length===11){
            phone.val(phone.val().replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3"));
            return true;
        }else{
            alert("잘못된 휴대폰 번호입니다. 숫자, - 를 포함한 숫자만 입력하세요.");
            return false;
        }
    }
    else
        return true;
}

$("#form_member").on("submit", function(event){
    if($("#member_contact").val()==="연락 경로를 선택하세요"){
        alert("연락 경로를 올바르게 선택하세요");
        return false;
    }
    if(checkPhone($("#member_phone"))){
        const name = $("#member_name").val();
        const query = {
            name: name,
            phone: $("#member_phone").val(),
            contact: $("#member_contact").val(),
            ap: ap
        };
        $.ajax({
            url: '/member',
            type: 'POST',
            data: query,
            success: function (data) {
                if(!data.ap){
                    if(data.exist){
                        alert("동일한 회원이 존재합니다.");
                        return false;
                    }
                    else
                        document.write(data);
                }
                else{
                    if(data.exist){
                        alert("동일한 회원이 존재합니다.");
                        return false;
                    }
                    else {
                        window.opener.member_id = data.member_id;
                        window.opener.document.getElementById('ap_name').value = name;
                        window.opener.document.getElementById('ap_name').disabled = true;
                        window.close();
                    }
                }
            }
        });
    };
    return false;
})

$("#form_member2").on("submit", function(event){
    if($("#member_contact2").val()===""){
        alert("연락 경로를 올바르게 선택하세요");
        return false;
    }
    if(checkPhone($("#member_phone2"))){
        const query = {
            name: $("#member_name2").val(),
            phone: $("#member_phone2").val(),
            contact: $("#member_contact2").val(),
            ap: false
        };
        $.ajax({
            url: '/member/'+member_id,
            type: 'PUT',
            data: query,
            success: function (data) {
                if(!ap)
                    document.write(data);
                else{
                    window.opener.member_name = $("#member_name2")
                }
            }
        });
    }
    return false;
});

window.onload = function(){
    contact_arr.forEach(function(item){
        if(contact === item)
            return;
        $("#member_contact2").append("<option>"+item+"</option>");
    })
};