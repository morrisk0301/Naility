let checked = [];

window.onload = async function () {
    $('#page-selection').bootpag({
        total: Math.ceil(parseInt(page_num)/15),
        page: page,
        maxVisible: 10
    }).on("page", function(event, num){
        window.location = "/procedure/search?"+url_string+"&page="+num.toString();
    });
    checked = JSON.parse($.cookie('checked'));
    $(".checkbox_procedure.flat").each(function(index, obj){
        const checkItem = checked.find(ck_item => ck_item.id === this.id);
        if(checkItem){
            $("#"+this.id).iCheck('check');
        }
    })
};

$("#btn_search").on("click", function(event){
    window.location = "/procedure/search?name="+$("#search_text").val();
});

$("#btn_procedure").on("click", function(event){
    let check = false;
    let name = "";
    let id_array = [];
    let price = 0;

    checked.forEach(function(item){
        id_array.push(item.id);
        name = name + item.name +" ";
        price += item.price;
        check = true;
    });
    if(!check){
        alert("시술을 선택해 주세요");
        return false;
    }

    window.opener.procedure = id_array;
    window.opener.pd_searched = true;
    window.opener.document.getElementById('ap_procedure').value = name;
    window.opener.document.getElementById('ap_price').textContent = price;
    window.opener.document.getElementById('ap_procedure').disabled = true;
    $.removeCookie('checked');
    window.close();
    return false;
});

$(".checkbox_procedure.flat").on("ifClicked", function(event){
    if(!this.checked){
        checked.push({
            id: this.id,
            name: $("#name_"+this.id.toString()).text(),
            price: parseInt($("#price_"+this.id.toString()).text())
        });
    }else{
        const checkItem = checked.find(ck_item => ck_item.id === this.id);
        console.log(checkItem);
        if(checked.indexOf(checkItem)>-1) checked.splice(checked.indexOf(checkItem), 1);
    }
    $.cookie("checked", JSON.stringify(checked));
    checked = JSON.parse($.cookie("checked"));
});