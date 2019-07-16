$("#add_name").keypress(function(e) {
    if (e.keyCode == 13){
        window.open("/member/search?query=membership_add&name="+$("#add_name").val(), "회원 검색", "width=500,height=600");
        return false;
    }
});

$("#give_name").keypress(function(e) {
    if (e.keyCode == 13){
        window.open("/member/search?query=membership_give&name="+$("#give_name").val(), "회원 검색", "width=500,height=600");
        return false;
    }
});

$("#get_name").keypress(function(e) {
    if (e.keyCode == 13){
        window.open("/member/search?query=membership_get&name="+$("#get_name").val(), "회원 검색", "width=500,height=600");
        return false;
    }
});

$("#refund_name").keypress(function(e) {
    if (e.keyCode == 13){
        window.open("/member/search?query=membership_refund&name="+$("#refund_name").val(), "회원 검색", "width=500,height=600");
        return false;
    }
});

$("#btn_search_member").on("click", function(event){
    window.open("/member/search?query=membership_add&name="+$("#add_name").val(), "회원 검색", "width=500,height=600");
    return false;
});

$("#btn_search_member2").on("click", function(event){
    window.open("/member/search?query=membership_give&name="+$("#give_name").val(), "회원 검색", "width=500,height=600");
    return false;
});

$("#btn_search_member3").on("click", function(event){
    window.open("/member/search?query=membership_get&name="+$("#get_name").val(), "회원 검색", "width=500,height=600");
    return false;
});

$("#btn_search_member4").on("click", function(event){
    window.open("/member/search?query=membership_refund&name="+$("#refund_name").val(), "회원 검색", "width=500,height=600");
    return false;
});

$("#btn_search_member5").on("click", function(event){
    window.open("/member/search?query=membership_transfer&name="+$("#transfer_name").val(), "회원 검색", "width=500,height=600");
    return false;
});

$("#btn_search_member6").on("click", function(event){
    window.open("/member/search?query=membership_deposit&name="+$("#deposit_name").val(), "회원 검색", "width=500,height=600");
    return false;
});

$("#btn_add").on("click", function(event){
    if(!window.add_searched){
        alert("회원을 선택해 주세요");
        return false;
    }
    if($("#add_value").val() < 0){
        alert("금액을 올바르게 입력해 주세요");
        return false;
    }
    if(new Date($("#exp_date").val()) < new Date() || !$("#exp_date").val()){
        alert("유효기간을 올바르게 입력해 주세요");
        return false;
    }
    if(confirm("정말 충전 하시겠습니까?")) {
        const query = {
            'member_id': window.add_member_id,
            'value': $("#add_value").val(),
            'method': $("#add_method").val(),
            'type': "충전",
            'exp_date': $("#exp_date").val(),
            'bonus': $("#add_bonus").val()
        };
        $.ajax({
            url: '/membership',
            type: 'POST',
            data: query,
            success: function (data) {
                if (data) {
                    alert("회원권 충전이 완료되었습니다");
                    window.location.reload();
                } else
                    alert("회원권 충전에 실패하였습니다.")
            }
        });
    }
    return false;
});

$("#btn_give").on("click", function(event){
    if(!window.get_searched || !window.give_searched){
        alert("회원을 선택해 주세요");
        return false;
    }
    if($("#give_value").val()<0 || !$("#give_value").val()){
        alert("금액을 올바르게 입력해 주세요");
        return false;
    }
    if(confirm("정말 양도 하시겠습니까??")) {
        const query = {
            'ms_id': window.get_ms_id,
            'get_member_id': window.get_member_id,
            'value': $("#give_value").val(),
            'type': "양도"
        };
        $.ajax({
            url: '/membership',
            type: 'PUT',
            data: query,
            success: function (data) {
                if (data) {
                    alert("회원권 양도가 완료되었습니다");
                    window.location.reload();
                } else
                    alert("회원권 잔액이 부족합니다.")
            }
        });
    };
    return false;
});

$("#btn_refund").on("click", function(event){
    if(!window.refund_searched){
        alert("회원을 선택해 주세요");
        return false;
    }
    if(parseInt($("#refund_real").text()) < 0){
        alert("금액을 올바르게 입력해 주세요");
        return false;
    }
    if(confirm("정말 환불 하시겠습니까?")){
        const query = {
            'ms_id': window.refund_ms_id,
            'member_id': window.refund_member_id,
            'value': $("#refund_value").val(),
            'type': "환불",
            'fee': $("#fee").val(),
            'method': $("#refund_method").val()
        };
        $.ajax({
            url: '/membership',
            type: 'PUT',
            data: query,
            success: function (data) {
                if(data){
                    alert("회원권 환불이 완료되었습니다");
                    window.location.reload();
                }
                else
                    alert("회원권 잔액이 부족합니다.")
            }
        });
    }
    return false;
});

$("#btn_transfer").on("click", function(event){
    if(!window.transfer_searched || !window.deposit_searched){
        alert("회원을 선택해 주세요");
        return false;
    }
    if($("#transfer_value").val()<0 || !$("#transfer_value").val()){
        alert("금액을 올바르게 입력해 주세요");
        return false;
    }
    if(confirm("정말 송금 하시겠습니까??")) {
        const query = {
            'ms_id': window.transfer_ms_id,
            'deposit_id': window.deposit_ms_id,
            'value': $("#transfer_value").val(),
            'type': "송금"
        };
        $.ajax({
            url: '/membership',
            type: 'PUT',
            data: query,
            success: function (data) {
                if (data) {
                    alert("회원권 송금이 완료되었습니다");
                    window.location.reload();
                } else
                    alert("회원권 잔액이 부족합니다.")
            }
        });
    };
    return false;
});

$("#refund_value").on("input", function(event){
    let refund_num = parseInt($("#refund_value").val()) - parseInt($("#fee").val());
    if(isNaN(refund_num))
        refund_num = parseInt($("#refund_value").val());
    $("#refund_real").text(refund_num);
});

$("#fee").on("input", function(event){
    let refund_num = parseInt($("#refund_value").val()) - parseInt($("#fee").val());
    if(isNaN(refund_num))
        refund_num = parseInt($("#refund_value").val());
    $("#refund_real").text(refund_num);
});

$('#myDatepicker').datetimepicker();

$("#btn_1w").on("click", function(event){
    $("#exp_date").val(moment().add(7, 'days').format('MM/DD/YYYY hh:mm a'));
    return false;
});

$("#btn_1m").on("click", function(event){
    $("#exp_date").val(moment().add(30, 'days').format('MM/DD/YYYY hh:mm a'));
    return false;
});

$("#btn_3m").on("click", function(event){
    $("#exp_date").val(moment().add(90, 'days').format('MM/DD/YYYY hh:mm a'));
    return false;
});

$("#btn_6m").on("click", function(event){
    $("#exp_date").val(moment().add(180, 'days').format('MM/DD/YYYY hh:mm a'));
    return false;
});

$("#btn_1y").on("click", function(event){
    $("#exp_date").val(moment().add(365, 'days').format('MM/DD/YYYY hh:mm a'));
    return false;
});