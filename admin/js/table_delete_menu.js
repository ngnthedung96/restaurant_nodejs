$(document).ready(function () {
    getMenu()
});



function getMenu() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/admins/menu",
        dataType: "json",
        success: function (data) {
            renderMenu(data.menu)
            deleteMenu()
        }
    });
}
function renderMenu(menu) {
    const menuGrid = document.querySelector(".Menu-grid .row")
    menuGrid.innerHTML = ""
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
    <div class="ibox ibox-menu">
        <div class="ibox-content product-box">
            <div style = "background-color:white" class="product-imitation">
            <img style = "width:100%" src="${food.img}" alt="">
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
                    <p class = "number-left"> Số lượng còn lại: ${food.number}</p>
                </div>
                <button type="button" class="mt-3 btn btn-outline-danger btn-delete">Xóa món ăn</button>
            </div>
        </div>
    </div>
        `
        menuGrid.appendChild(foodCol)
    }
}

function deleteMenu() {
    $(".btn-delete").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(e.target, '.ibox-menu')
        const id = Number(parentEl.querySelector(".product-id").innerText)
        $.ajax({
            type: "delete",
            url: `http://localhost:3333/api/admins/menu/delete/${id}`,
            dataType: "json",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                successFunction(data)
                getMenu()
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
            duration: 2000
        })

    }
}
function errorFunction(message) {
    toast({
        title: 'Error',
        message: `${message}`,
        type: 'Error',
        duration: 2000

    })
}