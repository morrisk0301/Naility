const host = location.host;

function getMemberNum(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/member_num')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function getAppointmentNum(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/appointment_num')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function getAppointmentMonthNum(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/appointment_month')
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
    })
}

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

window.onload = async function () {
    const memberNum = await getMemberNum();
    const apNum = await getAppointmentNum();
    const apMonthNum = await getAppointmentMonthNum();
    const date = daysInMonth(new Date().getMonth()+1, new Date().getFullYear());

    $("#user_num").text(memberNum);
    $("#appointment_num").text(apNum);
    $("#appointment_month_num").text(apMonthNum);
    $("#month").text(new Date().getMonth()+1);
    $("#appointment_dayavg").text(Math.round(apMonthNum/date));

}