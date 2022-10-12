$(document).ready(function () {
    addMenu()
});

function addMenu() {
    $(".add-btn").click(function (e) {
        e.preventDefault();
        const name = document.querySelector(".form-control.name").value.trim().toLowerCase()
        const price = document.querySelector(".form-control.price").value.trim()
        const im_price = document.querySelector(".form-control.im_price").value.trim()
        const type = document.querySelector(".form-control.type").value.trim()
        const number = document.querySelector(".form-control.number").value.trim()
        const img = document.querySelector(".form-control.img").value.trim()
        $.ajax({
            type: "POST",
            url: "http://localhost:3333/api/admins/menu/add",
            data: {
                name,
                im_price,
                price,
                number: Number(number),
                type,
                img
            },
            dataType: "json",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                successFunction(data)
            },
            error: function (data) {
                const err = data.responseJSON.errors[0].msg
                errorFunction(err)
            }
        });
    });

}

// ------toast---------------
import toast from "../toastResource/toast.js"
function successFunction(data) {
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