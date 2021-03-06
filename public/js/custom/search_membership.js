const host = location.host;
const urlParams = new URLSearchParams(window.location.search);
const userParam = urlParams.get('user');
let ms_raw;

function getMembershipInfo(id) {
    return new Promise(function (resolve, reject) {
        fetch('http://' + host + '/membership_member/' + id)
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function appendTable(id) {
    return new Promise(async function (resolve, reject) {
        $("#ap_tbody").empty();

        ms_raw = await getMembershipInfo(id);
        const ms_data = ms_raw.ms_data;

        ms_data.forEach(function (item, counter) {
            const value_left = ms_raw.value.find(value_item => value_item.ms_id === item.ms_id);
            const exp_date = new Date(item.ms_exp_date);
            const date = new Date(item.created_at);
            const pointer = counter % 2 === 0 ? 'odd pointer' : 'even pointer';
            const expired = item.ms_is_expired ? "만료" : "유효";
            let selector;
            if (query !== "membership_add" && query !== "membership_get") {
                selector = '<td class=" "><button class="btn btn-dark select_ms" id="select' + item.ms_id + '">회원권 선택</button></td>'
            } else {
                selector = '';
            }

            $("#ap_tbody").append('<tr class="' + pointer + '">' +
                '<td class=" ">' + item.ms_id + '</td>' +
                '<td class=" ">' + item.ms_init_value + '</td>' +
                '<td class=" ">' + value_left.value_left + '</td>' +
                '<td class=" ">' + expired + '</td>' +
                '<td class="a-right a-right ">' + exp_date.getFullYear() + '년 ' + (exp_date.getMonth() + 1).toString() + '월 ' + exp_date.getDate() + '일 ' + exp_date.getHours() + '시 ' + exp_date.getMinutes() + '분 ' + '</td>' +
                '<td class="a-right a-right ">' + date.getFullYear() + '년 ' + (date.getMonth() + 1).toString() + '월 ' + date.getDate() + '일 ' + date.getHours() + '시 ' + date.getMinutes() + '분 ' + '</td>' +
                '<td class=" "><a target="_blank" class="btn btn-dark" href="/membership/' + item.ms_id + '?query=search">조회</a>' + selector)
        })
        resolve(true);
    })
}

window.onload = async function () {
    $('#page-selection').bootpag({
        total: Math.ceil(parseInt(page_num) / 5),
        page: page,
        maxVisible: 10
    }).on("page", function (event, num) {
        window.location = "/member/search?" + url_string + "&page=" + num.toString();
    });
    if (userParam)
        await appendTable(userParam);
};

$("#btn_member").on("click", function (event) {
    let check = false;
    $(".checkbox_member").each(function (index, obj) {
        if (this.checked) {
            if (query === 'membership_add') {
                window.opener.add_searched = true;
                window.opener.add_member_id = this.id;
                window.opener.document.getElementById('add_name').value = $("#name_" + this.id.toString()).text();
                window.opener.document.getElementById('add_name').disabled = true;
            } else if (query === "membership_get") {
                window.opener.get_searched = true;
                window.opener.get_member_id = this.id;
                window.opener.document.getElementById('get_name').value = $("#name_" + this.id.toString()).text();
                window.opener.document.getElementById('get_name').disabled = true;
            }
        }
        window.close();
        check = true;
    });
    if (check)
        return false;
    else {
        alert("회원을 선택해 주세요");
        return false;
    }
});

$(".flat").on("ifClicked", async function (event) {
    const id = this.id;
    await appendTable(id);
});

$(document).on("click", ".select_ms", function () {
    let check = false;
    const ms_id = this.id.split('select')[1];
    $(".checkbox_member").each(function (index, obj) {
        if (this.checked) {
            if (query === "membership_give") {
                window.opener.give_searched = true;
                window.opener.get_member_id = this.id;
                window.opener.get_ms_id = ms_id;
                window.opener.document.getElementById('give_name').value = $("#name_" + this.id.toString()).text();
                window.opener.document.getElementById('give_name').disabled = true;
                window.opener.document.getElementById('give_membership').textContent = "회원권 ID: " + ms_id;
            } else if (query === "membership_refund") {
                const value_left = ms_raw.value.find(value_item => value_item.ms_id === parseInt(ms_id));
                window.opener.refund_searched = true;
                window.opener.refund_member_id = this.id;
                window.opener.refund_ms_id = ms_id;
                window.opener.document.getElementById('refund_name').value = $("#name_" + this.id.toString()).text();
                window.opener.document.getElementById('refund_name').disabled = true;
                window.opener.document.getElementById('refund_membership').textContent = "회원권 ID: " + ms_id;
                window.opener.document.getElementById('refund_value').value = value_left.value_left;
                window.opener.document.getElementById('refund_value').disabled = true;
            } else if (query === "membership_transfer") {
                window.opener.transfer_searched = true;
                window.opener.transfer_member_id = this.id;
                window.opener.transfer_ms_id = ms_id;
                window.opener.document.getElementById('transfer_name').value = $("#name_" + this.id.toString()).text();
                window.opener.document.getElementById('transfer_name').disabled = true;
                window.opener.document.getElementById('transfer_membership').textContent = "회원권 ID: " + ms_id;
            } else if (query === "membership_deposit") {
                window.opener.deposit_searched = true;
                window.opener.deposit_member_id = this.id;
                window.opener.deposit_ms_id = ms_id;
                window.opener.document.getElementById('deposit_name').value = $("#name_" + this.id.toString()).text();
                window.opener.document.getElementById('deposit_name').disabled = true;
                window.opener.document.getElementById('deposit_membership').textContent = "회원권 ID: " + ms_id;
            }
            window.close();
            check = true;
        }
    });
    if (query === "membership_only") {
        window.opener.only_searched = true;
        window.opener.only_ms_id = ms_id;
        window.opener.document.getElementById('method').disabled = true;
        window.opener.document.getElementById('membership').textContent = "회원권 ID: " + ms_id;
        window.close();
        return false;
    } else if (check)
        return false;
    else {
        alert("회원을 선택해 주세요");
        return false;
    }
});