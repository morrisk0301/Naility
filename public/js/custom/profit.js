const host = location.host;
const page = location.search.includes("page") ? location.search.split("page")[1][1] : 1;
const url_string = location.search.split("&page="+page)[0].replace("?", "");

window.onload = async function () {
    $('#page-selection').bootpag({
        total: Math.ceil(page_num/15),
        page: page
    }).on("page", function(event, num){
        window.location = "/profit?"+url_string+"&page="+num.toString();
    });
};