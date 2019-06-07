const host = location.host;

function getProcedureNum(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/user_num')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

window.onload = async function () {
    const procedureNum = await getProcedureNum();
    $('#page-selection').bootpag({
        total: Math.ceil(procedureNum/15),
        page: page,
        maxVisible: 10
    }).on("page", function(event, num){
        window.location = "/user?page="+num.toString();
    });
};

$("#btn_approve").on('click', function(event){
    let check = false;
    $(".checkbox_user").each(function(index, obj){
        if(this.checked){
            check = true;
            if(confirm("정말 승인 하시겠습니까?")) {
                $.ajax({
                    url: '/user/approve/' + this.id,
                    type: 'PUT',
                    success: function (data) {
                        document.write(data);
                    }
                });
            }
            return false;
        }
    })
    if(!check)
        alert("유저를 선택해주세요");
})

$("#btn_disprove").on('click', function(event){
    let check = false;
    $(".checkbox_user").each(function(index, obj){
        if(this.checked){
            check = true;
            if(confirm("정말 승인 취소 하시겠습니까?")) {
                $.ajax({
                    url: '/user/disprove/' + this.id,
                    type: 'PUT',
                    success: function (data) {
                        document.write(data);
                    }
                });
            }
            return false;
        }
    })
    if(!check)
        alert("유저를 선택해주세요");
})