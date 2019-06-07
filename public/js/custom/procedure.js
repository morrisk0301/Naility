const page = location.search.includes("page") ? location.search.split("page")[1][1] : 1;
let id;


window.onload = async function () {
    $('#page-selection').bootpag({
        total: Math.ceil(parseInt(page_num)/15),
        page: page,
        maxVisible: 10
    }).on("page", function(event, num){
        window.location = "/procedure?page="+num.toString();
    });
};

$("#btn_procedure").on("click", function(event){
    window.open("/add_procedure", "시술 추가", "width=500,height=600");
});

$("#btn_delete").on('click', function(event){
    let check = false;
    $(".checkbox_procedure").each(function(index, obj){
        if(this.checked){
            check = treu;
            if(confirm("정말 삭제 하시겠습니까?")){
                $.ajax({
                    url: '/procedure/'+this.id,
                    type: 'DELETE',
                    success: function (data) {
                        document.write(data);
                    }
                });
            }
            return false;
        }
    })
    if(!check)
        alert("시술 선택해주세요");
})

$("#btn_search").on("click", function(event){
    window.location = "/procedure?search="+$("#search_text").val();
})

$(".flat").on("ifChanged", function(event){
    id = this.id
})

$("#btn_modify").on("click", function(event){
    let check = false;
    $(".checkbox_procedure").each(function(index, obj){
        if(this.checked){
            check = true;
            window.open("/procedure/"+id, "시술 수정", "width=500,height=600");
            return false;
        }
    })
    if(!check)
        alert("시술을 선택해주세요");
})