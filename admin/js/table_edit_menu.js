$(document).ready(function () {
    getMenu()
});



function getMenu() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/admins/menu",
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            renderMenu(data.menu)
            updateProduct()
        }
    });
}
function renderMenu(menu) {
    const menuGrid = document.querySelector(".Menu-grid .row")
    menuGrid.innerHTML = ''
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
    <div class="ibox ibox-edit-menu">
        <div class="ibox-content product-box">
            <div style = "background-color:white" class="product-imitation">
            <img class = "product-img" style = "width:100%" src="${food.img}" alt="">
            </div>
            <div class="product-desc">
                <input class="form-control product-price" placeholder = "Giá bán: ${food.price}"  type = "text">
                <span class="form-control product-id hide">
                    ${food.id}
                </span>
                <small class="text-muted">${type}</small>
                <input type = "text" placeholder = "${food.name.toUpperCase()}" class="form-control product-name" > 
                <div class="m-t text-righ">
                    <input type = "number" class = "form-control number-left" placeholder = "Số lượng còn lại: ${food.number}" > 
                </div>
                <button type="button" class="mt-3 btn btn-outline-primary btn-update">Cập nhật</button>
            </div>
        </div>
    </div>
        `
        menuGrid.appendChild(foodCol)
    }
}

function updateProduct() {
    $(".btn-update").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(e.target, '.ibox-edit-menu')
        const imgDiv = parentEl.querySelector(".product-img")
        const img = imgDiv.getAttribute('src')
        const price = parentEl.querySelector(".product-price").value
        const id = Number(parentEl.querySelector(".product-id").innerText)
        const name = parentEl.querySelector(".product-name").value.toLowerCase()
        const number = parentEl.querySelector(".number-left").value
        if (img,
            price,
            id,
            name,
            number) {
            $.ajax({
                type: "PUT",
                url: "http://localhost:3333/api/admins/menu/update/",
                data: {
                    img,
                    price,
                    id,
                    name,
                    number
                },
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
        }
        else {
            errorFunction("Vui lòng nhập đủ thông tin")
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