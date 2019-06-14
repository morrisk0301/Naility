const host = location.host;
let chart1, chart2;

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
        fetch('http://'+host+'/appointment_method_rank')
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

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

async function init_flot_chart(){

    if( typeof ($.plot) === 'undefined'){ return; }

    console.log('init_flot_chart');

    let ap_data = await getAppointmentNum(new Date(moment().startOf('month')).toUTCString(), new Date(moment().endOf('month')).toUTCString());
    let pf_data = await getProfitData(new Date(moment().startOf('month')).toUTCString(), new Date(moment().endOf('month')).toUTCString());
    let arr_data = [];
    let arr_label = [];
    let arr_label2 = [];
    let arr_data2 = [];

    ap_data.reduce(function (total, item) {
        return total.then(() => {
            arr_data.push(item.count);
            arr_label.push(item._id.date);
        });
    }, Promise.resolve()).then(function () {
        const ctx = document.getElementById("chart_plot_01");
        chart1 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: arr_label,
                datasets: [{
                    label: '예약 수',
                    backgroundColor: "#26B99A",
                    data: arr_data
                }]
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });

    pf_data.reduce(function (total, item) {
        return total.then(() => {
            arr_data2.push(item.count);
            arr_label2.push(item._id.date);
        });
    }, Promise.resolve()).then(function () {
        const ctx = document.getElementById("chart_plot_02");
        chart2 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: arr_label2,
                datasets: [{
                    label: '매출 금액',
                    backgroundColor: "#03586A",
                    data: arr_data2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });

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
        let arr_label = [];
        ap_data.reduce(function (total, item) {
            return total.then(() => {
                arr_data.push(item.count);
                arr_label.push(item._id.date);
            });
        }, Promise.resolve()).then(function () {
            chart1.data.datasets = [{
                label: '예약 수',
                backgroundColor: "#26B99A",
                data: arr_data
            }];
            chart1.data.labels = arr_label;
            chart1.update();
        });
    });

    $('#reportrange2').on('apply.daterangepicker', async function(ev, picker) {
        const pf_data = await getProfitData(picker.startDate.toISOString(), picker.endDate.toISOString() );
        let arr_data = [];
        let arr_label = [];
        pf_data.reduce(function (total, item) {
            return total.then(() => {
                arr_data.push(item.count);
                arr_label.push(item._id.date);
            });
        }, Promise.resolve()).then(function () {
            chart2.data.datasets = [{
                label: '매출 금액',
                backgroundColor: "#03586A",
                data: arr_data
            }];
            chart2.data.labels = arr_label;
            chart2.update();
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
    try{$("#pf_value_1").text(Math.round(profitRank[0].count/1000)/10)}catch(e){console.log(e)}
    try{$("#pf_pg_1").css({'width' : '100%'})}catch(e){console.log(e)}
    try{$("#pf_rank_2").text(profitRank[1]._id.name)}catch(e){console.log(e)}
    try{$("#pf_value_2").text(Math.round(profitRank[1].count/1000)/10)}catch(e){console.log(e)}
    try{$("#pf_pg_2").css({'width' : Math.round((profitRank[1].count / profitRank[0].count)*100) + '%'})}catch(e){console.log(e)}
    try{$("#pf_rank_3").text(profitRank[2]._id.name)}catch(e){console.log(e)}
    try{$("#pf_value_3").text(Math.round(profitRank[2].count/1000)/10)}catch(e){console.log(e)}
    try{$("#pf_pg_3").css({'width' : Math.round((profitRank[2].count / profitRank[0].count)*100) + '%'})}catch(e){console.log(e)}
    try{$("#pf_rank_4").text(profitRank[3]._id.name)}catch(e){console.log(e)}
    try{$("#pf_value_4").text(Math.round(profitRank[3].count/1000)/10)}catch(e){console.log(e)}
    try{$("#pf_pg_4").css({'width' : Math.round((profitRank[3].count / profitRank[0].count)*100) + '%'})}catch(e){console.log(e)}
    try{$("#pf_rank_5").text(profitRank[4]._id.name)}catch(e){console.log(e)}
    try{$("#pf_value_5").text(Math.round(profitRank[4].count/1000)/10)}catch(e){console.log(e)}
    try{$("#pf_pg_5").css({'width' : Math.round((profitRank[4].count / profitRank[0].count)*100) + '%'})}catch(e){console.log(e)}
}

function setChart4(apRank){
    let val1 = 0, val2 = 0, val3 = 0, val4 = 0, val5 = 0;
    if(apRank.ap_data.find(ap_item => ap_item._id.method === "현금")) val1 = Math.round(apRank.ap_data.find(ap_item => ap_item._id.method === "현금").count/apRank.count*100);
    if(apRank.ap_data.find(ap_item => ap_item._id.method === "카드")) val2 = Math.round(apRank.ap_data.find(ap_item => ap_item._id.method === "카드").count/apRank.count*100);
    if(apRank.ap_data.find(ap_item => ap_item._id.method === "이체")) val3 = Math.round(apRank.ap_data.find(ap_item => ap_item._id.method === "이체").count/apRank.count*100);
    if(apRank.ap_data.find(ap_item => ap_item._id.method === "회원권")) val4 = Math.round(apRank.ap_data.find(ap_item => ap_item._id.method === "회원권").count/apRank.count*100);
    if(apRank.ap_data.find(ap_item => ap_item._id.method === "기타")) val5 = Math.round(apRank.ap_data.find(ap_item => ap_item._id.method === "기타").count/apRank.count*100);
    const label = ["현금", "카드", "이체", "회원권", "기타"];
    const data = [val1, val2, val3, val4, val5];
    init_chart_doughnut(label, data, "dn1");
    $("#pf_method_val_1").text(val1+'%');
    $("#pf_method_val_2").text(val2+'%');
    $("#pf_method_val_3").text(val3+'%');
    $("#pf_method_val_4").text(val4+'%');
    $("#pf_method_val_5").text(val5+'%');
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

    $("#user_num").text(memberNum);
    $("#appointment_num").text(apNum);
    $("#appointment_month_num").text(apMonthNum);
    $("#month").text(new Date().getMonth()+1);
    $("#appointment_dayavg").text(Math.round(apMonthNum/moment().date()));


};



