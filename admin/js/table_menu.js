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
            order()
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
            </div>
        </div>
    </div>
        `
        menuGrid.appendChild(foodCol)
    }
}

function order() {
    const path = (window.location.search.split(''))
    var id = null
    for (var i = 0; i < path.length; i++) {
        if (path[i] === '=') {
            id = path.splice(i + 1, path.length).join('')
        }
    }
    if (id) {
        $(".add-btn").click(function (e) {
            e.preventDefault();
            const parentEl = getParent(this, ".product-desc")
            const table_order_id = id
            const food_id = Number(parentEl.querySelector(".product-id").innerText)
            const number = Number(parentEl.querySelector(".product-number").value)
            const food_price = Number(parentEl.querySelector(".product-price").innerText)
            const today = new Date();
            const time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes()
            if (number === 0) {
                errorFunction("Vui lòng nhập số lượng")
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3333/api/admins/order/create",
                    data: {
                        table_order_id,
                        food_id,
                        number,
                        food_price,
                        time
                    },
                    dataType: "json",
                    headers: {
                        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
                    },
                    success: function (data) {
                        successFunction(data)
                    },
                    error: function (data) {
                        if (data.responseJSON.errors) {
                            const err = data.responseJSON.errors[0].msg
                            errorFunction(err)
                        }
                        else {
                            console.log(data.responseJSON)
                            errorFunction(data.responseJSON.msg)
                        }

                    }
                });
            }
        });
    }

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
        setTimeout(() => {
            location.reload()
        }, 1000);

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