$(document).ready(function () {
    selectTimeToGet()
});

function getTime(start, end) {
    $('#order-sort span').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'));
    $.ajax({
        type: "GET",
        url: `http://localhost:3333/api/admins/table_order/show/${start.format('YYYY-MM-DD HH:mm')}&${end.format('YYYY-MM-DD HH:mm')}`,
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

function renderTableDetail(data, idOfTO) {
    let dataTable = []
    var count = 1
    const tableDiv = document.querySelector(".ibox-history .table")
    for (var table_order of data.table_orderArr) {
        dataTable.push([count, table_order.tableName, table_order.adminName, table_order.tableId, table_order.table_orderId, table_order.price, '<button type="button" class="btn btn-outline-success btn-show-detail">Xem chi tiết</button>'])
        count++
    }
    $(tableDiv).DataTable({
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
                    $(this).addClass("table-name")
                }
                else if (colIndex == 2) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("admin-name")
                }
                else if (colIndex == 3) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("table-id")
                    $(this).addClass("hide")
                }
                else if (colIndex == 4) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("idOfTO")
                    $(this).addClass("hide")
                }
                else if (colIndex == 5) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("total-price")

                }
                else if (colIndex == 6) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("btn-show-detail")

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