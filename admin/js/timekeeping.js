$(document).ready(function () {
    createTimeIn()
    createTimeOut()
    getdate()
    selectAdmin()
});
function selectAdmin() {
    $('.select-admin-time__in').select2();
    $('.select-admin-time__out').select2();
    const selectAdminTimeInDiv = document.querySelector(".select-admin-time__in")
    const selectAdminTimeOutDiv = document.querySelector(".select-admin-time__out")
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/admins/showalladmins",
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            let html = '<option disabled selected>Tìm kiếm bằng số điện thoại</option>'
            for (let admin of data.admins) {
                html += `
                <option value="${admin.id}"><span>Tên nhân viên: ${admin.name}</span> Số điện thoại: ${admin.phonenumber}</option>
                `
            }
            selectAdminTimeInDiv.innerHTML = html
            selectAdminTimeOutDiv.innerHTML = html
        }
    });

}
function getdate() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    if (s < 10) {
        s = "0" + s;
    }
    if (m < 10) {
        m = "0" + m;
    }
    $("#time_span").text(`Thời gian hiện tại: ${h} : ${m} : ${s}`);
    setTimeout(function () { getdate() }, 500);
}


function createTimeIn() {
    const today = new Date();
    const time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes()
    // $(".btn-post-timeIn").unbind()
    const postBtn = document.querySelector(".btn-post-timeIn")
    postBtn.addEventListener("click", function (e) {
        const selectAdminTimeInDiv = document.querySelector(".select-admin-time__in")
        e.preventDefault();
        if (Number(selectAdminTimeInDiv.value)) {
            $.ajax({
                type: "POST",
                url: "http://localhost:3333/api/admins/timekeeping/createtimeIn/",
                data: {
                    admin_id: Number(selectAdminTimeInDiv.value),
                    timeIn: time
                },
                dataType: "JSON",
                headers: {
                    token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
                },
                success: function (data) {
                    successFunction(data)
                },
                error: function (err) {
                    errorFunction(err.responseJSON.msg)
                }
            });
        }
        else {
            errorFunction("Vui lòng chọn nhân viên chấm công")
        }
    })
    // $(".btn-post-timeIn").click(function (e) {
    //     console.log(1)
    //     e.preventDefault();
    //     if (Number(selectAdminTimeInDiv.value)) {
    //         $.ajax({
    //             type: "POST",
    //             url: "http://localhost:3333/api/admins/timekeeping/createtimeIn/",
    //             data: {
    //                 admin_id: Number(selectAdminTimeInDiv.value),
    //                 timeIn: time
    //             },
    //             dataType: "JSON",
    //             headers: {
    //                 token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
    //             },
    //             success: function (data) {
    //                 check()
    //             }
    //         });
    //     }
    //     else {
    //         errorFunction("Vui lòng chọn nhân viên chấm công")
    //     }

    // });
}
function createTimeOut() {
    $(".btn-post-timeIn").unbind()
    $(".btn-post-timeOut").click(function (e) {
        const today = new Date();
        const time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes()
        const selectAdminTimeOutDiv = document.querySelector(".select-admin-time__out")
        e.preventDefault();
        if (Number(selectAdminTimeOutDiv.value)) {
            $.ajax({
                type: "POST",
                url: "http://localhost:3333/api/admins/timekeeping/createtimeOut/",
                data: {
                    admin_id: Number(selectAdminTimeOutDiv.value),
                    timeOut: time
                },
                dataType: "JSON",
                headers: {
                    token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
                },
                success: function (data) {
                    successFunction(data)
                },
                error: function (err) {
                    errorFunction(err.responseJSON.msg)
                }
            });
        }
        else {
            errorFunction("Vui lòng chọn nhân viên chấm công")
        }

    });
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