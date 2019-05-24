const page = location.search.includes("page") ? location.search.split("page")[1][1] : 1;
const url_string = location.search.split("&page="+page)[0].replace("?", "");
const host = location.host;
let start, end;
let id;

function init_daterangepicker() {
    if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
    console.log('init_daterangepicker');

    var cb = function(start, end, label) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    var optionSet1 = {
        startDate: moment(),
        endDate: moment().add(90, 'days'),
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
            '다음 90일': [moment(), moment().add(90, 'days')],
            '다음 180일': [moment(), moment().add(180, 'days')],
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

    $('#reportrange span').html(moment().format('MMMM D, YYYY') + ' - ' + moment().add(90, 'days').format('MMMM D, YYYY'));
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
    init_daterangepicker();
    $('#page-selection').bootpag({
        total: Math.ceil(parseInt(page_num)/2),
        page: page
    }).on("page", function(event, num){
        window.location = "/membership?"+url_string+"&page="+num.toString();
    });
    start = new Date(moment()).toUTCString();
    end = new Date(moment().add(90, 'days')).toUTCString();
};

$("#btn_search").on("click", function(event){
    const query = "name="+$("#search_name").val()+"&phone="+$("#search_phone").val()+"&start="+start+"&end="+end;
    window.location = "/membership?search=true&"+ query;
    return false;
});
