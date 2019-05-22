const host = location.host;

function verifyID(userID){
    return new Promise(function(resolve, reject){
        if(!userID)
            resolve(false);
        else {
            fetch('http://' + host + '/user/' + userID)
                .then((res) => res.json())
                .then((data) => {
                    if (data)
                        resolve(true);
                    else
                        resolve(false);
                })
        }
    })
}


$("#login_btn").on("click", function(event){
    $.ajax({
        url: '/login',    //Your api url
        type: 'POST',   //type is any HTTP method
        data: {userID:"iluvubtch", password:"453mor3013"},      //Data as js object
        success: function () {
            window.location = "/"
        }
    });
})



$("#userID").on('input', async function(event){
    const is_registered = await verifyID($("#userID").val());
    if(is_registered)
        $("#warning_id").text("이미 회원가입한 아이디 입니다.");
    else
        $("#warning_id").text("");
})

$("#form_signup").on('submit', function(event){
    const password = $("#password").val();
    const password_cf = $("#password_confirm").val();

    if(password !== password_cf) {
        alert('비밀번호 확인 값이 올바르지 않습니다.');
        return false;
    }

    if(password.length < 8){
        alert('비밀번호는 최소 8자리 이상이어야 합니다.');
        return false;
    }
})