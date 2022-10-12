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
            showDetail()
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
    let dataTable = []
    let count = 1
    for (var timekeeping of data.timekeeping) {
        const dateStringIn = moment.unix(timekeeping.timeIn).format(`2022-09-27 HH:mm`);
        const dateStringOut = moment.unix(timekeeping.timeOut).format(`2022-09-27 HH:mm`);
        var duration = moment.duration(moment(dateStringOut).diff(moment(dateStringIn)));
        dataTable.push([count, adminData.id, adminData.name, dateStringIn, dateStringOut, duration.asHours().toFixed(1), Number(duration.asHours().toFixed(1) * Number(adminData.salary_hour))])
        count++
    }
    console.log(dataTable)
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
                    $(this).addClass("admin-phone")
                }
                else if (colIndex == 4) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("admin-email")
                }
                else if (colIndex == 5) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("time-keeping")

                }

            });
        },
        "bDestroy": true,
        "bPaginate": false
    });



}

function showDetail() {
    $(".btn-show-detail").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(this, "tr")
        const toId = parentEl.querySelector(".idOfTO").innerText
        window.open(`/admin/history_detail.html?idOfTO=${toId}`)
    });
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