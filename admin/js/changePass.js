$(document).ready(function () {
    checkPermission()
    changePass()
});
function checkPermission() {
    if (localStorage.getItem("accessAdminToken")) {
        $.ajax({
            url: "http://localhost:3333/api/admins/home",
            type: "GET",
            dataType: 'json',
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                if (data.admin.permission <= 1) {
                    const nav = document.querySelector('.breadcrumb')
                    nav.innerHTML = `
                    <li class="breadcrumb-item">
                            <a href="index.html">Home</a>
                        </li>
                        <li class="breadcrumb-item active">
                            <strong>Đổi mật khẩu</strong>
                        </li>
                    `
                }
            }
        })
    }

}

function renderTable(idOfTO) {
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/admins/table",
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            renderTableDetail(data, idOfTO)
            orderTable()
            deleteOrderTable()
            openModal()
            usedTable()
            deleteUsedTable()
            pay()
            orderFood()


        }
    });
}


function changePass() {
    const oldPass = document.querySelector("#old-pass")
    const newPass = document.querySelector("#new-pass")
    $(".btn-update").click(function (e) {
        e.preventDefault();
        if (oldPass.value.length >= 7 && newPass.value.length >= 7) {
            console.log(oldPass.value,
                newPass.value)
            if (oldPass.value === newPass.value) {
                errorFunction("Mật khẩu mới phải khác mật khẩu cũ")
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3333/api/admins/changpassword/",
                    headers: {
                        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
                    },
                    data: {
                        oldPass: oldPass.value,
                        newPass: newPass.value
                    },
                    dataType: "json",
                    success: function (data) {
                        successFunction(data)
                    },
                    error: function (err) {
                        errorFunction(err.responseJSON.msg)
                    }
                });
            }
        }
        else {
            errorFunction("Vui lòng nhập đủ mật khẩu với độ dài lớn hơn 7")
        }
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
            type: 'Success'
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