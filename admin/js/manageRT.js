$(document).ready(function () {
    selectTimeToGet()
});


function getTime(start, end) {
    $('#order-sort span').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'))
    $.ajax({
        type: "GET",
        url: `http://localhost:3333/api/admins/requesttable/show/${start.format('YYYY-MM-DD HH:mm')}&${end.format('YYYY-MM-DD HH:mm')}`,
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            renderTableDetail(data)
            action()
        }
    });

}

function action() {
    $(".btn-accept").click(function (e) {
        const parentEl = getParent(e.target, 'tr')
        const id = parentEl.querySelector('.request-id').innerText
        e.preventDefault();
        $.ajax({
            type: "PUT",
            url: `http://localhost:3333/api/admins/requesttable/acceptRequest/${Number(id)}`,
            dataType: "json",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                selectTimeToGet()
            }
        });

    });
}

function selectTimeToGet(idOfTO) {
    let start = moment().startOf('day');
    let end = moment().endOf('day');
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
    let dataTable = []
    let countRow = 1
    for (var request of data.requests) {
        // render table 
        if (request.status === 0) {
            dataTable.push([countRow, request.id, request.phonenumber, request.username,
                request.quantity, request.special_request,
                moment.unix(request.time).format("DD-MM-YYYY HH:mm"), moment.unix(request.time_created).format("DD-MM-YYYY HH:mm"),
                '<button type="button" class="btn btn-outline-success btn-accept">Chấp nhận</button>',
                ' <button type="button" class="btn btn-outline-danger btn-refuse">Từ chối</button>'])
        }
        else if (request.status === 1) {
            dataTable.push([countRow, request.id, request.phonenumber, request.username,
                request.quantity, request.special_request,
                moment.unix(request.time).format("DD-MM-YYYY HH:mm"), moment.unix(request.time_created).format("DD-MM-YYYY HH:mm"),
                "<p class = 'text-success'>Đã chấp nhận</p>", ""])
        }
        else if (request.status === -2) {
            dataTable.push([countRow, request.id, request.phonenumber, request.username,
                request.quantity, request.special_request,
                moment.unix(request.time).format("DD-MM-YYYY HH:mm"), moment.unix(request.time_created).format("DD-MM-YYYY HH:mm"),
                "<p class = 'text-danger'>Khách đã hủy yêu cầu</p>", ""])
        }

        else {
            dataTable.push([countRow, request.id, request.phonenumber, request.username,
                request.quantity, request.special_request,
                request.time, request.time_created,
                "<p class = 'text-danger'>Đã từ chối</p>", ""])
        }

        countRow++
    }
    $(".ibox-request-table .table").DataTable({
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
                    $(this).addClass("request-id")
                    $(this).addClass("hide")
                }
                else if (colIndex == 2) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("username")
                }
                else if (colIndex == 3) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("quantity")
                }
                else if (colIndex == 4) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("special_request")
                }
                else if (colIndex == 5) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("time")

                }
                else if (colIndex == 6) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("time_created")
                }
                else if (colIndex == 7) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("button")
                }
            });
        },
        "bDestroy": true,
        "bPaginate": false
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