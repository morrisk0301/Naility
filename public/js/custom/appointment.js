const host = location.host;
const page = location.search.includes("page") ? location.search.split("page")[1][1] : 1;
const url_string = location.search.split("&page="+page)[0].replace("?", "");
let id;
let start, end;
const urlParams = new URLSearchParams(window.location.search);
const nameParam = urlParams.get('name');
const phoneParam = urlParams.get('phone');
const startParam = urlParams.get('start');
const endParam = urlParams.get('end');

function init_daterangepicker() {
    if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
    console.log('init_daterangepicker');

    var cb = function(start, end, label) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    var optionSet1 = {
        startDate: moment(start),
        endDate: moment(end),
        minDate: '01/01/2019',
        maxDate: '12/31/2100',
        dateLimit: {
            days: 60
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            '이번 달': [moment().startOf('month'), moment().endOf('month')],
            '다음 달': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
            '다음 15일': [moment(), moment().add(15, 'days')],
            '다음 30일': [moment(), moment().add(30, 'days')]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
    };

    $('#reportrange').daterangepicker(optionSet1, cb);
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
        start = new Date(picker.startDate).toUTCString();
        end = new Date(picker.endDate).toUTCString();
    });

    $('#options1').click(function() {
        $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
    });
    $('#options2').click(function() {
        $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
    });
    $('#destroy').click(function() {
        $('#reportrange').data('daterangepicker').remove();
    });

}

window.onload = async function () {
    if(nameParam) $("#search_name").val(nameParam);
    if(phoneParam) $("#search_phone").val(phoneParam);
    if(!startParam && !endParam){
        start = new Date(moment().startOf('month')).toUTCString();
        end = new Date(moment().endOf('month')).toUTCString();
        $('#reportrange span').html(moment().startOf('month').format('MMMM D, YYYY') + ' - ' + moment().endOf('month').format('MMMM D, YYYY'));
    }else{
        start = new Date(startParam);
        end = new Date(endParam);
        $('#reportrange span').html(moment(start).format('MMMM D, YYYY') + ' - ' + moment(end).format('MMMM D, YYYY'));
    }
    init_daterangepicker();
    $('#page-selection').bootpag({
        total: Math.ceil(page_num/15),
        page: page,
        maxVisible: 10
    }).on("page", function(event, num){
        window.location = "/appointment?"+url_string+"&page="+num.toString();
    });
};

$(".checkbox_appointment, .flat").on("ifChanged", function(event){
    id = this.id
})

$("#btn_view").on("click", function(event){
    let check = false;
    $(".checkbox_appointment").each(function(index, obj){
        if(this.checked){
            check = true;
            window.open("/appointment/"+id+"?query=modify", "예약 조회", "width=500,height=600");
            return false;
        }
    });
    if(!check)
        alert("예약을 선택해주세요");
});

$("#btn_search").on("click", function(event){
    const query = "name="+$("#search_name").val()+"&phone="+$("#search_phone").val()+"&start="+start+"&end="+end;
    window.location = "/appointment?search=true&"+ query;
    return false;
});