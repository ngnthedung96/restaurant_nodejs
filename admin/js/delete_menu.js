$(document).ready(function () {
    getMenu()
});

function order() {

}

function getMenu() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/admins/menu",
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            console.log(data)
            renderMenu(data.menu)
            deleteMenu(data)
        }
    });
}
function renderMenu(menu) {
    const menuGrid = document.querySelector(".Menu-grid .row")
    for (var food of menu) {
        const foodCol = document.createElement("div")
        foodCol.classList.add("col-md-3")
        let type = null
        if (food.type === 1) {
            type = "Món Chính"
        }
        else if (food.type === 2) {
            type = "Món Phụ"
        }
        else {
            type = "Đồ Uống"
        }
        foodCol.innerHTML = `
    <div class="ibox">
        <div class="ibox-content product-box">
            <div class="product-imitation">
                [ INFO ]
            </div>
            <div class="product-desc">
                <span class="product-price">
                    ${food.price}
                </span>
                <span class="product-id hide">
                    ${food.id}
                </span>
                <small class="text-muted">${type}</small>
                <a href="#" class="product-name"> ${food.name.toUpperCase()}</a>
                <div class="m-t text-righ">
                    <a href="#" class="btn btn-xs btn-outline btn-danger delete-btn">Xóa món <i class="fa fa-long-arrow-right"></i> </a>
                </div>
            </div>
        </div>
    </div>
        `
        menuGrid.appendChild(foodCol)
    }
}

function deleteMenu(menu) {
    $(".delete-btn").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(e.target, ".product-desc")
        const id = parentEl.querySelector(".product-id").innerText
        $.ajax({
            type: "POST",
            url: "http://localhost:3333/api/admins/menu/delete",
            data: {
                id: Number(id)
            },
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            dataType: "json",
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
function successFunction(data) {
    if (data.status) {
        toast({
            title: 'Success',
            message: `${data.msg}`,
            type: 'Success',
        })
        setTimeout(() => {
            location.reload()
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