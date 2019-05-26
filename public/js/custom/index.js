const host = location.host;

const chart_plot_01_settings = {
    series: {
        lines: {
            show: false,
            fill: true
        },
        splines: {
            show: true,
            tension: 0.4,
            lineWidth: 1,
            fill: 0.4
        },
        points: {
            radius: 0,
            show: true
        },
        shadowSize: 2,
    },
    grid: {
        verticalLines: true,
        hoverable: true,
        clickable: true,
        tickColor: "#d5d5d5",
        borderWidth: 1,
        color: '#fff'
    },
    colors: ["rgba(38, 185, 154, 0.38)", "rgba(3, 88, 106, 0.38)"],
    xaxis: {
        tickColor: "rgba(51, 51, 51, 0.06)",
        mode: "time",
        tickSize: [1, "day"],
        //tickLength: 10,
        axisLabel: "Date",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: 'Verdana, Arial',
        axisLabelPadding: 10
    },
    yaxis: {
        ticks: 8,
        tickColor: "rgba(51, 51, 51, 0.06)",
    },
    tooltip: false
};
const chart_plot_02_settings = {
    grid: {
        show: true,
        aboveData: true,
        color: "#3f3f3f",
        labelMargin: 10,
        axisMargin: 0,
        borderWidth: 0,
        borderColor: null,
        minBorderMargin: 5,
        clickable: true,
        hoverable: true,
        autoHighlight: true,
        mouseActiveRadius: 100
    },
    series: {
        lines: {
            show: true,
            fill: true,
            lineWidth: 2,
            steps: false
        },
        points: {
            show: true,
            radius: 4.5,
            symbol: "circle",
            lineWidth: 3.0
        }
    },
    legend: {
        position: "ne",
        margin: [0, -25],
        noColumns: 0,
        labelBoxBorderColor: null,
        labelFormatter: function(label, series) {
            return label + '&nbsp;&nbsp;';
        },
        width: 40,
        height: 1
    },
    colors: ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'],
    shadowSize: 0,
    tooltip: true,
    tooltipOpts: {
        content: "%s: %y.0",
        xDateFormat: "%d/%m",
        shifts: {
            x: -30,
            y: -50
        },
        defaultTheme: false
    },
    yaxis: {
        min: 0
    },
    xaxis: {
        mode: "time",
        tickSize: [1, "day"],
        //tickLength: 10,
        axisLabel: "Date",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: 'Verdana, Arial',
        axisLabelPadding: 10
    },
};

function sortWithDate(a, b){
    console.log(a);
    if(a._id.date < b._id.date)
        return -1;
    if(a.index > b.index)
        return 1;
    return 0;
}
function getMemberNum(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/member_num')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function getAppointmentNum(start, end, total){
    return new Promise(function(resolve, reject){
        let query = total ? "?total=true&" : "?";
        if(start)
            query += "start="+start+"&end="+end;
        fetch('http://'+host+'/appointment_num'+query)
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function getAppointmentMethodRank(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/apointment_method_rank')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function getAppointmentTypeRank(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/appointment_type_rank')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function getProfitData(start, end, total){
    return new Promise(function(resolve, reject){
        const query = "?start="+start+"&end="+end;
        fetch('http://'+host+'/profit_num'+query)
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function getProfitRank(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/profit_rank')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

async function init_flot_chart(){

    if( typeof ($.plot) === 'undefined'){ return; }

    console.log('init_flot_chart');

    let ap_data = await getAppointmentNum(new Date(moment().startOf('month')).toUTCString(), new Date(moment().endOf('month')).toUTCString());
    let pf_data = await getProfitData(new Date(moment().startOf('month')).toUTCString(), new Date(moment().endOf('month')).toUTCString());
    ap_data = ap_data.sort(sortWithDate);
    pf_data = pf_data.sort(sortWithDate);
    let arr_data = [];
    let arr_data2 = [];
    ap_data.reduce(function (total, item) {
        return total.then(() => {
            arr_data.push([gd(item._id.year, item._id.month, item._id.day), item.count])
        });
    }, Promise.resolve()).then(function () {
        $.plot( $("#chart_plot_01"), [ arr_data ],  chart_plot_01_settings );
    });

    pf_data.reduce(function (total, item) {
        return total.then(() => {
            arr_data2.push([gd(item._id.year, item._id.month, item._id.day), item.count])
        });
    }, Promise.resolve()).then(function () {
        $.plot( $("#chart_plot_02"),
            [{
                data: arr_data2,
                lines: {
                    fillColor: "rgba(150, 202, 89, 0.12)"
                },
                points: {
                    fillColor: "#fff" }
            }], chart_plot_02_settings);
    });

    if ($("#chart_plot_01").length){
        console.log('Plot1');
        $.plot( $("#chart_plot_01"), [ arr_data ],  chart_plot_01_settings );
    }

    if ($("#chart_plot_02").length){
        console.log('Plot2');
    }
}

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
            '지난 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            '지난 7일': [moment().subtract(6, 'days'), moment()],
            '지난 30일': [moment().subtract(29, 'days'), moment()]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
    };

    $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    $('#reportrange2 span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    $('#reportrange').daterangepicker(optionSet1, cb);
    $('#reportrange2').daterangepicker(optionSet1, cb);
    $('#reportrange').on('apply.daterangepicker', async function(ev, picker) {
        const ap_data = await getAppointmentNum(new Date(picker.startDate), new Date(picker.endDate));
        let arr_data = [];
        ap_data.reduce(function (total, item) {
            return total.then(() => {
                arr_data.push([gd(item._id.year, item._id.month, item._id.day), item.count])
            });
        }, Promise.resolve()).then(function () {
            $.plot( $("#chart_plot_01"), [ arr_data ],  chart_plot_01_settings );
        });
    });

    $('#reportrange2').on('apply.daterangepicker', async function(ev, picker) {
        const pf_data = await getProfitData(picker.startDate.toISOString(), picker.endDate.toISOString() );

        let arr_data = [];
        pf_data.reduce(function (total, item) {
            return total.then(() => {
                arr_data.push([gd(item._id.year, item._id.month, item._id.day), item.count])
            });
        }, Promise.resolve()).then(function () {
            $.plot( $("#chart_plot_02"),
                [{
                    data: arr_data,
                    lines: {
                        fillColor: "rgba(150, 202, 89, 0.12)"
                    },
                    points: {
                        fillColor: "#fff" }
                }], chart_plot_02_settings);
        });
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

function setChart3(profitRank){
    try{$("#pf_rank_1").text(profitRank[0]._id.name)}catch(e){console.log(e)}
    try{$("#pf_value_1").text(Math.round(profitRank[0].count/10000))}catch(e){console.log(e)}
    try{$("#pf_pg_1").css({'width' : '100%'})}catch(e){console.log(e)}
    try{$("#pf_rank_2").text(profitRank[1]._id.name)}catch(e){console.log(e)}
    try{$("#pf_value_2").text(Math.round(profitRank[1].count/10000))}catch(e){console.log(e)}
    try{$("#pf_pg_2").css({'width' : Math.round((profitRank[1].count / profitRank[0].count)*100) + '%'})}catch(e){console.log(e)}
    try{$("#pf_rank_3").text(profitRank[2]._id.name)}catch(e){console.log(e)}
    try{$("#pf_value_3").text(Math.round(profitRank[2].count/10000))}catch(e){console.log(e)}
    try{$("#pf_pg_3").css({'width' : Math.round((profitRank[2].count / profitRank[0].count)*100) + '%'})}catch(e){console.log(e)}
    try{$("#pf_rank_4").text(profitRank[3]._id.name)}catch(e){console.log(e)}
    try{$("#pf_value_4").text(Math.round(profitRank[3].count/10000))}catch(e){console.log(e)}
    try{$("#pf_pg_4").css({'width' : Math.round((profitRank[3].count / profitRank[0].count)*100) + '%'})}catch(e){console.log(e)}
    try{$("#pf_rank_5").text(profitRank[4]._id.name)}catch(e){console.log(e)}
    try{$("#pf_value_5").text(Math.round(profitRank[4].count/10000))}catch(e){console.log(e)}
    try{$("#pf_pg_5").css({'width' : Math.round((profitRank[4].count / profitRank[0].count)*100) + '%'})}catch(e){console.log(e)}
}

function setChart4(apRank){
    const val1 = Math.round(apRank.ap_data.find(ap_item => ap_item._id.method === "현금").count/apRank.count*100);
    const val2 = Math.round(apRank.ap_data.find(ap_item => ap_item._id.method === "카드").count/apRank.count*100);
    const val3 = Math.round(apRank.ap_data.find(ap_item => ap_item._id.method === "이체").count/apRank.count*100);
    const val4 = Math.round(apRank.ap_data.find(ap_item => ap_item._id.method === "회원권").count/apRank.count*100);
    const val5 = Math.round(apRank.ap_data.find(ap_item => ap_item._id.method === "기타").count/apRank.count*100);
    const label = ["현금", "카드", "이체", "회원권", "기타"];
    const data = [val1, val2, val3, val4, val5];
    init_chart_doughnut(label, data, "dn1");
    try{$("#pf_method_val_1").text(val1+'%')}catch(e){console.log(e)}
    try{$("#pf_method_val_2").text(val2+'%')}catch(e){console.log(e)}
    try{$("#pf_method_val_3").text(val3+'%')}catch(e){console.log(e)}
    try{$("#pf_method_val_4").text(val4+'%')}catch(e){console.log(e)}
    try{$("#pf_method_val_5").text(val5+'%')}catch(e){console.log(e)}
}

function setChart5(apTypeRank){
    let label = [];
    let data = [];
    apTypeRank.ap_data.forEach(function(item, counter){
        $("#pf_type_"+(counter+1)).append(item._id.procedure);
        label.push(item._id.procedure);
        $("#pf_type_value_"+(counter+1)).text(Math.round(item.count/apTypeRank.count*100)+'%');
        data.push(Math.round(item.count/apTypeRank.count*100));
    });
    init_chart_doughnut(label, data, "dn2");

}

window.onload = async function () {
    init_daterangepicker();
    init_flot_chart();
    const memberNum = await getMemberNum();
    const profitRank = await getProfitRank();
    setChart3(profitRank);
    const apRank = await getAppointmentMethodRank();
    setChart4(apRank);
    const apTypeRank = await getAppointmentTypeRank();
    setChart5(apTypeRank);
    const apNum = await getAppointmentNum(null, null, true);
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toUTCString();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toUTCString();
    const apMonthNum = await getAppointmentNum(firstDay, lastDay, true);
    const date = daysInMonth(new Date().getMonth()+1, new Date().getFullYear());

    $("#user_num").text(memberNum);
    $("#appointment_num").text(apNum);
    $("#appointment_month_num").text(apMonthNum);
    $("#month").text(new Date().getMonth()+1);
    $("#appointment_dayavg").text(Math.round(apMonthNum/date));


};



