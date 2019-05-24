const host = location.host;
const page = location.search.includes("page") ? location.search.split("page")[1][1] : 1;
const url_string = location.search.split("&page="+page)[0].replace("?", "");
let id;
let start, end;

function init_daterangepicker() {
    if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
    console.log('init_daterangepicker');

    var cb = function(start, end, label) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    var optionSet1 = {
        startDate: moment().startOf('month'),
        endDate: moment().endOf('month'),
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

    $('#reportrange span').html(moment().startOf('month').format('MMMM D, YYYY') + ' - ' + moment().endOf('month').format('MMMM D, YYYY'));
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
    $('#page-selection').bootpag({
        total: Math.ceil(page_num/15),
        page: page
    }).on("page", function(event, num){
        window.location = "/profit?"+url_string+"&page="+num.toString();
    });
    start = new Date(moment().startOf('month')).toUTCString();
    end = new Date(moment().endOf('month')).toUTCString();
    init_daterangepicker();
};


$("#btn_search").on("click", function(event){
    const type = $("#search_type").val() === "매출 구분" ? "" : $("#search_type").val();
    const category = $("#search_category").val() === "매출 종류" ? "" : $("#search_category").val();
    const method = $("#search_method").val() === "결제 수단" ? "" : $("#search_method").val();
    const query = "name="+$("#search_name").val()+"&phone="+$("#search_phone").val()+"&type="+type+"&category="+category+"&method="+method+"&start="+start+"&end="+end;
    window.location = "/profit?search=true&"+ query;
    return false;
});