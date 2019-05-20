const host = location.host;
const procedure_id = location.pathname.split('/')[2];

function getCategory() {
    return new Promise(function (resolve, reject) {
        fetch('http://' + host + '/category')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

window.onload = async function () {
    const category = await getCategory();
    category.forEach(function(item){
        $("#select_procedure").append($('<option>', {
            text : item
        }));
        const select = $("#select_procedure2");
        if(select.val() !== item){
            select.append($('<option>', {
                text : item
            }));
        }
    })
}

$("#form_procedure").on("submit", function(event){
    if($("#select_procedure").val() === "카테고리를 선택하세요") {
        alert("카테고리를 알맞게 선택하세요");
        return false;
    }
})

$("#form_procedure2").on("submit", function(event){
    const query = {
        name: $("#name2").val(),
        category: $("#select_procedure2").val(),
        price: $("#price2").val()
    }
    $.ajax({
        url: '/procedure/'+procedure_id,
        type: 'PUT',
        data: query,
        success: function (data) {
            document.write(data);
        }
    });
    return false;
});