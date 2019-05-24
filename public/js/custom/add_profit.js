$("#btn_search_member").on("click", function(event){
    window.open("/member/search?query=ap&name="+$("#ap_name").val(), "회원 검색", "width=500,height=600");
    return false;
})

$("#btn_profit").on("click", function(event){

    if(!window.ap_searched && !window.member_id){
        alert("회원을 선택해 주세요");
        return false;
    }
    else if($("#pf_type").val() === "매출 구분을 선택하세요"){
        alert("매출 구분을 선택해 주세요");
        return false;
    }
    else if($("#pf_category").val() === "매출 종류를 선택하세요"){
        alert("매출 종류를 선택해 주세요");
        return false;
    }


    const query = {
        member_id: window.member_id,
        pf_type: $("#pf_type").val(),
        pf_category: $("#pf_category").val(),
        pf_value: $("#pf_type").val()==="환불" ? -parseInt($("#pf_value").val()) : $("#pf_value").val(),
        pf_method: $("#pf_method").val(),
    };
    $.ajax({
        url: '/profit',
        type: 'POST',
        data: query,
        success: function (data) {
            document.write(data);
        }
    });
    return false;
})