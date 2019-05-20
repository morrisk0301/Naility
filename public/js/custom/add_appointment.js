$("#btn_search_procedure").on("click", function(event){
    window.open("/procedure/search?name="+$("#ap_procedure").val(), "시술 추가", "width=500,height=600");
    return false;
})
$("#btn_search_member").on("click", function(event){
    window.open("/member/search?query=ap&name="+$("#ap_name").val(), "회원 검색", "width=500,height=600");
    return false;
})

$(function () {
    $('#datetimepicker').datetimepicker();
});

$("#btn_appointment").on("click", function(event){
    if(!window.procedure || !window.pd_searched){
        alert("시술을 선택해 주세요")
        return false
    }
    else if(!$("#date").val()){
        alert("날짜를 선택해 주세요")
        return false;
    }
    else if(!window.ap_searched){
        alert("회원을 선택해 주세요")
        return false;
    }
    const query = {
        member_id: window.member_id,
        procedure: JSON.stringify(window.procedure),
        date: $("#date").val(),
        price: $("#ap_price").val()
    }
    $.ajax({
        url: '/appointment',
        type: 'POST',
        data: query,
        success: function (data) {
            document.write(data);
        }
    });
    return false;
})

$("#btn_add").on("click", function(event){
    window.open("/add_member?ap=true", "회원 추가", "width=500,height=600");
    return false;
})