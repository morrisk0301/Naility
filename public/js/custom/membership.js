const page = location.search.includes("page") ? location.search.split("page")[1][1] : 1;
const url_string = location.search.split("&page="+page)[0].replace("?", "");

window.onload = async function () {
    $('#page-selection').bootpag({
        total: Math.ceil(parseInt(page_num)/15),
        page: page
    }).on("page", function(event, num){
        window.location = "/membership?"+url_string+"&page="+num.toString();
    });
};

$("#btn_search").on("click", function(event){
    const query = $("#search_query").val() === "이름" ? "name" : "phone"
    window.location = "/membership?search="+$("#search_text").val()+"&query="+ query;
})