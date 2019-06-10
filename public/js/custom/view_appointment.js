const category = ["현금", "카드", "이체", "회원권", "기타"];
let isBlacklist;
let isNoShow;

window.onload = async function () {
    const selected = $("#method").val();
    if(blacklist){
        $("#blacklist").iCheck("check");
        $("#blacklist2").iCheck("check");
    }
    else{
        $("#blacklist").iCheck("uncheck");
        $("#blacklist2").iCheck("uncheck");
    }
    if(noShow){
        $("#no_show").iCheck("check");
        $("#no_show2").iCheck("check");
    }
    else{
        $("#no_show").iCheck("uncheck");
        $("#no_show2").iCheck("uncheck");
    }

    category.forEach(function(item){
        if(selected === item)
            return;
        $("#method").append($('<option>', {
            text : item
        }, '</option>'));
    })
};

$("#btn_appointment").on("click", function(event){
    if($("#method").val() === '회원권' && !window.only_ms_id){
        alert("회원권을 선택해 주세요");
        return false;
    }
    let query = {
        'method': $("#method").val(),
        'detail': $("#detail").val(),
        'ms_id': ms_id ? ms_id : window.only_ms_id,
        'blacklist': isBlacklist
    };
    $.ajax({
        url: '/appointment/'+$("#ap_id").val()+"?query=modify",
        type: 'PUT',
        data: query,
        success: function (data) {
            document.write(data);
        }
    });
    return false;
});

$("#blacklist").on("ifChanged", function(event){
    isBlacklist = event.target.checked;
});

$("#no_show").on("ifChanged", function(event){
    isNoShow = event.target.checked;
});


$("#method").on("change", function(event){
    if($("#method").val()==='회원권'){
        $("#div_method").append('<div class="form-group" id="div_membership">'+
            '<label class="control-label col-md-3 col-sm-3 col-xs-12">회원권 </label>' +
            '<div class="col-md-9 col-sm-9 col-xs-12">' +
            '<div id="membership" class="form-control"></div></div></div>'
        );
        window.open("/member/search?query=membership_only&user="+member_id, "회원권 검색", "width=500,height=600");
    } else{
        $("#div_membership").empty();
    }
    return false;
});