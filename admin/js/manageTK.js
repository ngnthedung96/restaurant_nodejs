$(document).ready(function () {
    selectTimeToGet()
});


function getTime(start, end) {
    const path = (window.location.search.split(''))
    var id = null
    for (var i = 0; i < path.length; i++) {
        if (path[i] === '=') {
            id = path.splice(i + 1, path.length).join('')
        }
    }
    $('#order-sort span').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'))
    $.ajax({
        type: "GET",
        url: `http://localhost:3333/api/admins/timekeeping/show/${id}&${start.format('YYYY-MM-DD HH:mm')}&${end.format('YYYY-MM-DD HH:mm')}`,
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            renderTableDetail(data)
            handleSalary()
        }
    });

}



function selectTimeToGet(idOfTO) {
    let start = moment().subtract(29, 'days');
    let end = moment();
    $('#order-sort').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment().startOf('day'), moment().endOf('day')],
            'Yesterday': [moment().subtract(1, 'days'), moment()],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, getTime);
    getTime(start, end);
}

function renderTableDetail(data) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    //check admin
    var id = null
    const path = (window.location.search.split(''))
    for (var i = 0; i < path.length; i++) {
        if (path[i] === '=') {
            id = path.splice(i + 1, path.length).join('')
        }
    }
    let adminData = null
    $.ajax({
        async: false,
        type: "GET",
        url: `http://localhost:3333/api//admins/showadmin/${id}`,
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        dataType: "json",
        success: function (data) {
            adminData = data.admin
        }
    });
    let timeInCheck = adminData.timeIn
    let timeOutCheck = adminData.timeOut
    let events = []
    let dataTable = []
    let countRow = 1
    for (var timekeeping of data.timekeeping) {
        let timeIn = moment.unix(timekeeping.timeIn).format("DD-MM-YYYY HH:mm");
        let time = moment().format("DD-MM-YYYY HH:mm")
        let count = Number(timeIn.split('-')[1]) - Number(time.split('-')[1])

        const dateStringInCheck = moment.unix(timeInCheck).format(`2022-09-27 HH:mm`);
        const dateStringIn = moment.unix(timekeeping.timeIn).format(`2022-09-27 HH:mm`);
        const dateStringOut = moment.unix(timekeeping.timeOut).format(`2022-09-27 HH:mm`);
        var duration = moment.duration(moment(dateStringIn).diff(moment(dateStringInCheck)));
        var durationToCalSal = moment.duration(moment(dateStringOut).diff(moment(dateStringIn)));
        var hours = duration.asMinutes();
        if (Number(timekeeping.timeOut) === 1) {
            events.push({
                title: `Chưa kết ca`,
                start: new Date(y, m + count, timeIn.split('-')[0]),
                allDay: true
            })
        }
        else if (hours > 0) {
            events.push({
                title: `Đi muộn ${hours} phút`,
                start: new Date(y, m + count, timeIn.split('-')[0]),
                allDay: true
            })

            // render table 
            dataTable.push([countRow, adminData.id, adminData.name, dateStringIn, dateStringOut, durationToCalSal.asHours().toFixed(1), Number(durationToCalSal.asHours().toFixed(1) * Number(adminData.salary_hour))])
            countRow++
        }

        else {
            events.push({
                title: 'Đi làm',
                start: new Date(y, m + count, timeIn.split('-')[0]),
                allDay: true
            })

            // render table 
            dataTable.push([countRow, adminData.id, adminData.name, dateStringIn, dateStringOut, durationToCalSal.asHours().toFixed(1), Number(durationToCalSal.asHours().toFixed(1) * Number(adminData.salary_hour))])
            countRow++
        }
    }
    $('#calendar').fullCalendar('destroy');
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        droppable: true,
        events
    });
    $(".ibox-salary .table").DataTable({
        data: dataTable,
        createdRow: function (row, data, dataIndex) {
            $.each($('td', row), function (colIndex) {
                // For example, adding data-* attributes to the cell
                if (colIndex == 0) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("count")
                }
                else if (colIndex == 1) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("admin-id")
                }
                else if (colIndex == 2) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("admin-name")
                }
                else if (colIndex == 3) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("time-in")
                }
                else if (colIndex == 4) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("time-out")
                }
                else if (colIndex == 5) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("number-hours")

                }
                else if (colIndex == 6) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("salary-hour")

                }

            });
        },
        "bDestroy": true,
        "bPaginate": false
    });


}
function handleSalary() {
    const salary_total = document.querySelector(".salary-total h2")
    const salary_hours = document.querySelectorAll(".salary-hour")
    let count = 0
    for (let salary_hour of salary_hours) {
        count += Number(salary_hour.innerText)
    }
    salary_total.innerText = `Tổng tiền lương: ${count}`
}








function getParent(el, parentEl) {
    var parentEl
    var element = el.parentElement
    while (element) {
        if (element.matches(`${parentEl}`)) {
            parentEl = element
            break
        }
        element = element.parentElement
    }

    return parentEl
}

// ------toast---------------
import toast from "../toastResource/toast.js"
function successFunction(data, check) {
    if (data.status) {
        toast({
            title: 'Success',
            message: `${data.msg}`,
            type: 'Success',
        })
        setTimeout(() => {
            renderTable()
        }, 1000);

    }
}
function errorFunction(message) {
    toast({
        title: 'Error',
        message: `${message}`,
        type: 'Error'
    })
}