$("#btn_search_member").on("click", function(event){
    window.open("/member/search?query=membership_add&name="+$("#add_name").val(), "회원 검색", "width=500,height=600");
    return false;
})

$("#btn_search_member2").on("click", function(event){
    window.open("/member/search?query=membership_give&name="+$("#give_name").val(), "회원 검색", "width=500,height=600");
    return false;
})

$("#btn_search_member3").on("click", function(event){
    window.open("/member/search?query=membership_get&name="+$("#get_name").val(), "회원 검색", "width=500,height=600");
    return false;
})

$("#btn_search_member4").on("click", function(event){
    window.open("/member/search?query=membership_refund&name="+$("#refund_name").val(), "회원 검색", "width=500,height=600");
    return false;
})

$("#btn_add").on("click", function(event){
    if(!window.add_searched){
        alert("회원을 선택해 주세요");
        return false;
    }
    const query = {
        'member_id': window.add_member_id,
        'value': $("#add_value").val(),
        'type': "충전"
    };
    $.ajax({
        url: '/membership',
        type: 'POST',
        data: query,
        success: function (data) {
            if(data){
                alert("회원권 충전이 완료되었습니다")
                window.location.reload();
            }
            else
                alert("회원권 충전에 실패하였습니다.")
        }
    });
    return false;
})

$("#btn_give").on("click", function(event){
    if(!window.get_searched || !window.give_searched){
        alert("회원을 선택해 주세요");
        return false;
    }
    const query = {
        'member_id': window.give_member_id,
        'get_member_id': window.get_member_id,
        'value': $("#give_value").val(),
        'type': "양도"
    };
    $.ajax({
        url: '/membership',
        type: 'POST',
        data: query,
        success: function (data) {
            if(data){
                alert("회원권 양도가 완료되었습니다")
                window.location.reload();
            }
            else
                alert("회원권 잔액이 부족합니다.")
        }
    });
    return false;
})

$("#btn_refund").on("click", function(event){
    if(!window.refund_searched){
        alert("회원을 선택해 주세요");
        return false;
    }
    const query = {
        'member_id': window.refund_member_id,
        'value': $("#refund_value").val(),
        'type': "환불",
        'fee': $("#fee").val()
    };
    $.ajax({
        url: '/membership',
        type: 'POST',
        data: query,
        success: function (data) {
            if(data){
                alert("회원권 환불이 완료되었습니다")
                window.location.reload();
            }
            else
                alert("회원권 잔액이 부족합니다.")
        }
    });
    return false;
})

$("#refund_value").on("input", function(event){
    $("#refund_real").val(parseInt($("#refund_value").val()) - parseInt($("#fee").val()));
})

$("#fee").on("input", function(event){
    $("#refund_real").val(parseInt($("#refund_value").val()) - parseInt($("#fee").val()));
})