const host = location.host;
let ap_data;
let ap_selected;
let id_selected;

function setAppointmentCalendar(){
    return new Promise(function(resolve, reject){
        fetch('http://'+host+'/appointment?query=calendar')
            .then((res) => res.json())
            .then((data) => {
                ap_data = data;
                resolve(true);
            })
    })
}

function getEvent(ap_data){
    return new Promise(function(resolve, reject){
        let event = [];
        ap_data.forEach(function(item){
            const query = {
                title: item.ap_member_name+'('+item.ap_member_phone+')',
                start: new Date(item.ap_date),
                end: new Date(item.ap_date_end),
                id: item.ap_id
            };
            event.push(query);
        });
        resolve(event);
    })
}

function modifyDate(ap_id, start, end){
    return new Promise(function(resolve, reject){
        const query = {
            date: start,
            date_end: end
        };
        $.ajax({
            url: '/appointment/'+ap_id+'?query=date',
            type: 'PUT',
            data: query,
            success: function (data) {
                if(!data)
                    resolve(false);
                else
                    resolve(true);
            }
        });
    })
}


window.onload = async function() {
    await setAppointmentCalendar();
    const event = await getEvent(ap_data);



    if( typeof ($.fn.fullCalendar) === 'undefined'){ return; }
    console.log('init_calendar');

    var calendar = $('#calendar').fullCalendar({
        defaultView: 'agendaDay',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'agendaDay,agendaWeek,month, listMonth'
        },
        timezone: 'local',
        selectable: true,
        selectHelper: true,
        select: function(start, end, allDay) {
            $('#fc_create').click();
            const start_date = new Date(start);
            const end_date = new Date(end);
            const ampm = parseInt(start_date.getHours()/12) === 0 ? 'AM' : 'PM';
            const ampm_end = parseInt(end_date.getHours()/12) === 0 ? 'AM' : 'PM';

            started = start;
            ended = end;

            $("#date").text(("0" + (start_date.getMonth() + 1)).slice(-2) + '/' + ("0" +
                start_date.getDate()).slice(-2)+'/'+start_date.getFullYear()+' '+ (start_date.getHours()%12) + ":"+
                ("0" + start_date.getMinutes()).slice(-2) + ' ' + ampm
            );

            $("#date_end").text(("0" + (end_date.getMonth() + 1)).slice(-2) + '/' + ("0" +
                end_date.getDate()).slice(-2)+'/'+end_date.getFullYear()+' '+ (end_date.getHours()%12) + ":"+
                ("0" + end_date.getMinutes()).slice(-2) + ' ' + ampm_end
            );

        },
        eventClick: function(calEvent, jsEvent, view) {
            $('#fc_edit').click();
            id_selected = calEvent._id;

            ap_selected = ap_data.find(ap_item => ap_item.ap_id === calEvent.id);
            const start_date = new Date(ap_selected.ap_date);
            const end_date = new Date(ap_selected.ap_date_end);
            const ampm = parseInt(start_date.getHours()/12) === 0 ? 'AM' : 'PM';
            const ampm_end = parseInt(end_date.getHours()/12) === 0 ? 'AM' : 'PM';

            $("#ap_name2").text(ap_selected.ap_member_name);
            $("#ap_procedure2").text(ap_selected.ap_procedure_name);
            $("#ap_price2").text(ap_selected.ap_price);
            $("#date2").text(("0" + (start_date.getMonth() + 1)).slice(-2) + '/' + ("0" +
                start_date.getDate()).slice(-2)+'/'+start_date.getFullYear()+' '+ (start_date.getHours()%12) + ":"+
                ("0" + start_date.getMinutes()).slice(-2) + ' ' + ampm
            );
            $("#date_end2").text(("0" + (end_date.getMonth() + 1)).slice(-2) + '/' + ("0" +
                end_date.getDate()).slice(-2)+'/'+end_date.getFullYear()+' '+ (end_date.getHours()%12) + ":"+
                ("0" + end_date.getMinutes()).slice(-2) + ' ' + ampm_end
            );



            $(".antosubmit2").on("click", function() {
                calEvent.title = $("#title2").val();

                calendar.fullCalendar('updateEvent', calEvent);
                $('.antoclose2').click();
            });

            calendar.fullCalendar('unselect');
        },
        eventDrop: async function ( event, delta, revertFunc, jsEvent, ui, view ){
            const success = await modifyDate(event.id, new Date(event.start), new Date(event.end));
            if(success){
                await setAppointmentCalendar();
            }else{
                alert("이미 마감한 예약은 수정할 수 없습니다.");
                revertFunc();
            }
        },
        eventResize: async function( event, delta, revertFunc, jsEvent, ui, view ) {
            const success = await modifyDate(event.id, new Date(event.start), new Date(event.end));
            if(success){
                await setAppointmentCalendar();
            }else{
                alert("이미 마감한 예약은 수정할 수 없습니다.");
                revertFunc();
            }
        },
        editable: true,
        events: event
    });
};


$("#btn_search_procedure").on("click", function(event){
    window.open("/procedure/search?name="+$("#ap_procedure").val(), "시술 추가", "width=500,height=600");
    return false;
});

$("#btn_search_procedure2").on("click", function(event){
    window.open("/procedure/search?name="+$("#ap_procedure2").val(), "시술 추가", "width=500,height=600");
    return false;
});

$("#btn_search_member").on("click", function(event){
    window.open("/member/search?query=ap&name="+$("#ap_name").val(), "회원 검색", "width=500,height=600");
    return false;
});


$("#btn_add").on("click", function(event){
    window.open("/add_member?ap=true", "회원 추가", "width=500,height=600");
    return false;
});

$('.antoclose, .antoclose2').on("click", function(){
    $("#ap_name").val('');
    $("#ap_name").prop('disabled', false);
    $("#ap_price").text('');
    $("#ap_price2").text('');
    $("#ap_procedure").val('');
    $("#ap_procedure").prop('disabled', false);
    $("#ap_procedure2").text('');
});

$("#btn_appointment_delete").on("click", function(event){
    if(confirm("정말 삭제 하시겠습니까?")){
        $.ajax({
            url: '/appointment/'+ap_selected.ap_id,
            type: 'DELETE',
            success: function (data) {
                if(data){
                    $('.antoclose2').click();
                    $('#calendar').fullCalendar('removeEvents', id_selected);
                } else{
                    alert("이미 마감한 예약은 삭제할 수 없습니다.");
                    return false;
                }
            }
        });
    }
    return false;
});

$("#btn_appointment_new").on("click", function(event){
    if(!window.procedure || !window.pd_searched){
        alert("시술을 선택해 주세요");
        return false
    }
    else if(!window.ap_searched && !window.member_id){
        alert("회원을 선택해 주세요");
        return false;
    }
    const query = {
        member_id: window.member_id,
        procedure: JSON.stringify(window.procedure),
        date: $("#date").text(),
        date_end: $("#date_end").text(),
        price: $("#ap_price").text()
    };
    $.ajax({
        url: '/appointment',
        type: 'POST',
        data: query,
        success: function (data) {
            if(!data.err){
                setAppointmentCalendar().then(() =>{
                    $('.antoclose').click();
                    $('#calendar').fullCalendar('renderEvent', {
                            title: data.ap_member_name+'('+data.ap_member_phone+')',
                            start: new Date(data.ap_date),
                            end: new Date(data.ap_date_end),
                            id: data.ap_id
                        },
                        true
                    );
                    $('#calendar').fullCalendar('unselect');
                });
            }
            else{
                alert("예약 추가에 실패하였습니다.");
                return false;
            }
        }
    });
    return false;
});