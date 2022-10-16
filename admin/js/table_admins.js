$(document).ready(function () {
    getAdmin()
});

function getAdmin() {
    $.ajax({
        type: "GET",
        url: `http://localhost:3333/api/admins/showalladmins`,
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            renderTableDetail(data)
            showDetail()
            deleteAdmin()
        }
    });

}


function renderTableDetail(data, idOfTO) {
    let dataTable = []
    var count = 1
    const tableDiv = document.querySelector(".ibox-history .table")
    for (var admin of data.admins) {
        dataTable.push([count, admin.id, admin.name, admin.phonenumber, admin.email, '<button type="button" class="btn btn-outline-success btn-show-detail">Xem chi tiết</button>', `<button 
        data-toggle="modal" data-target="#Modal" type="button" class="btn btn-outline-danger btn-show-deleteDetail">Xóa tài khoản</button>`])
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
    $(".time-keeping button").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(this, "tr")
        const admin_id = parentEl.querySelector(".admin-id").innerText
        window.open(`/admin/manageTK.html?admin_id=${admin_id}`)
    });
}
function deleteAdmin() {
    $(".btn-show-deleteDetail").click(function (e) {
        e.preventDefault();
        const adminIdInModal = document.querySelector('#Modal .modal-body .admin-id')
        adminIdInModal.innerText = ''
        const parentEl = getParent(e.target, 'tr')
        const admin_id = parentEl.querySelector(".admin-id")
        adminIdInModal.innerText = admin_id.innerText
    });
    $(".btn-delete-admin").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(e.target, '.modal-content')
        const admin_id = parentEl.querySelector(".admin-id").innerText
        console.log(1)
        $.ajax({
            type: "DELETE",
            url: `http://localhost:3333/api/admins/delete/${Number(admin_id)}`,
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            dataType: "json",
            success: function (data) {
                successFunction(data)
                getAdmin()
            },
            error: function (err) {
                errorFunction(err.responseJSON.msg)
            }
        });
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

    }
}
function errorFunction(message) {
    toast({
        title: 'Error',
        message: `${message}`,
        type: 'Error'
    })
}