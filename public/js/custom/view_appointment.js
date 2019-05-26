const category = ["현금", "카드", "이체", "회원권", "기타"];
let isBlacklist;

window.onload = async function () {
    const selected = $("#payment_method").val();
    if(blacklist){
        $("#blacklist").iCheck("check");
        $("#blacklist2").iCheck("check");
    }
    else{
        $("#blacklist").iCheck("uncheck");
        $("#blacklist2").iCheck("uncheck");
    }

    category.forEach(function(item){
        if(selected === item)
            return;
        $("#payment_method").append($('<option>', {
            text : item
        }, '</option>'));
    })
};

$("#btn_appointment").on("click", function(event){
    let query = {
        'method': $("#payment_method").val(),
        'detail': $("#detail").val(),
        'blacklist': isBlacklist
    }
    $.ajax({
        url: '/appointment/'+$("#ap_id").val()+"?query=modify",
        type: 'PUT',
        data: query,
        success: function (data) {
            document.write(data);
        }
    });
    return false;
})

$("#blacklist").on("ifChanged", function(event){
    isBlacklist = event.target.checked;
})