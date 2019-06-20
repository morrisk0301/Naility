const host = location.host;
let start, end;
let id;
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
            days: 730
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            '다음 90일': [moment(), moment().add(90, 'days')],
            '다음 180일': [moment(), moment().add(180, 'days')],
            '다음 365일': [moment(), moment().add(365, 'days')],
            '이번 달': [moment().startOf('month'), moment().endOf('month')],
            '다음 달': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
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
        start = new Date(moment()).toUTCString();
        end = new Date(moment().add(90, 'days')).toUTCString();
        $('#reportrange span').html(moment().format('MMMM D, YYYY') + ' - ' + moment().add(90, 'days').format('MMMM D, YYYY'));
    }else{
        start = new Date(startParam);
        end = new Date(endParam);
        $('#reportrange span').html(moment(start).format('MMMM D, YYYY') + ' - ' + moment(end).format('MMMM D, YYYY'));
    }
    init_daterangepicker();
    $('#page-selection').bootpag({
        total: Math.ceil(parseInt(page_num)/15),
        page: page
    }).on("page", function(event, num){
        window.location = "/membership?"+url_string+"&page="+num.toString();
    });
};

$("#btn_search").on("click", function(event){
    const query = "name="+$("#search_name").val()+"&phone="+$("#search_phone").val()+"&start="+start+"&end="+end;
    window.location = "/membership?search=true&"+ query;
    return false;
});
