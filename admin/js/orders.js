$(document).ready(function () {
    resetOption()
    getMenu()
});



function getMenu() {
    const path = (window.location.search.split(''))
    var id = null
    for (var i = 0; i < path.length; i++) {
        if (path[i] === '=') {
            id = path.splice(i + 1, path.length).join('')
        }
    }
    let count = null
    if (localStorage.getItem("numberOpt")) {
        count = Number(localStorage.getItem("numberOpt"))
    }
    $.ajax({
        type: "GET",
        url: `http://localhost:3333/api/admins/order/show/${id}`,
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            renderMenu(data.orderArr, count)
            addOption()
            updateOrder()
            renderLogs(id)

        }
    });
}
function renderMenu(orders, count) {
    const orderGrid = document.querySelector(".ibox")
    let htmls = ""
    htmls += `
    <div class="ibox-title">
        <h5>Items in your cart</h5>
    </div>
    `
    for (var order of orders) {
        const orderCol = document.createElement("div")
        orderCol.classList.add("col-md-3")
        let type = null
        if (order.food.type === 1) {
            type = "Món Chính"
        }
        else if (order.food.type === 2) {
            type = "Món Phụ"
        }
        else {
            type = "Đồ Uống"
        }
        htmls += `
        <div class="ibox-content update">
            <div class="table-responsive">
                <table class="table shoping-cart-table">
                    <tbody>
                    <tr>
                        <td width="90">
                            <div class="cart-product-imitation">
                            </div>
                        </td>
                        <select class = "product hide update" name="" id="">
                            <option  data-price = "${order.food.price}" value="${order.food.id}"></option>
                        </select>
                        <td class="desc">
                            <h3>
                            <a href="#" class="text-navy">
                            ${order.food.name.toUpperCase()}
                            </a>
                            </h3>
                            <p class="small">
                               Số lượng còn lại: ${order.food.number}
                            </p>
                            <p class="order-id hide">${order.order.id}
                            </p>
                            <p class="small">
                               Số lượng đã chọn: ${order.order.number}
                            </p>
                        </td>
                        <td width="120">
                            <p class = "number-des">Số lượng thêm</p>
                            <input type="number" class="form-control product-number-add"  min="0" placeholder="0">
                            <p class = "number-des">Số lượng xóa</p>
                            <input type="number" class="form-control product-number-delete"  min="0" placeholder="0">
                        </td>
                        <td>
                            <h4>
                            ${order.food.price}
                            </h4>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
            `
    }
    const food_idDiv = document.querySelectorAll(".ibox select")
    const food_idArr = []
    for (let i of food_idDiv) {
        food_idArr.push(Number(i.value))
    }
    for (let i = 0; i < count; i++) {
        let htmlsOfOpt = ''
        $.ajax({
            async: false,
            type: "GET",
            url: "http://localhost:3333/api/admins/menu",
            dataType: "json",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                for (let food of data.menu) {
                    if (!food_idArr.includes(food.id)) {
                        htmlsOfOpt += `
                    <option  data-price = "${food.price}" value="${food.id}"><h3>${food.name.toUpperCase()}</h3></option>
                    `
                    }

                }
            }
        });
        if (htmlsOfOpt) {
            htmls += `
            <div class="ibox-content ">
                <div class="table-responsive">
                    <table class="table shoping-cart-table">
                        <tbody>
                        <tr>
                            <td width="90">
                                <div class="cart-product-imitation">
                                </div>
                            </td>
                            <td class="desc">
                                <select class = "product add" name="" id="">
                                 ${htmlsOfOpt}
                                </select>
                            </td>
                            <td width="100">
                                <input type="number"  min="0" class="form-control product-number-add" placeholder="0" >
                                <input type="number"  min="0" class="form-control product-number-delete hide" placeholder="0" >
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
    `
        }
    }
    htmls +=
        `<div class="ibox-footer">
        <button class="btn btn-primary float-right btn-add-row"><i class="fa fa fa-plus"></i> Thêm món</button>
        <button class="btn btn-success float-right btn-add-food"><i class="fa fa fa-shopping-cart"></i> Cập nhật</button>
    </div>`
    orderGrid.innerHTML = htmls
}



function addOption() {
    $(".btn-add-row").click(function (e) {
        e.preventDefault();
        if (localStorage.getItem("numberOpt")) {
            let count = Number(localStorage.getItem("numberOpt"))
            console.log(count++)
            localStorage.setItem('numberOpt', count++);
        }
        else {
            localStorage.setItem('numberOpt', 1);
        }
        getMenu()
    });
}

function updateOrder() {
    $(".btn-add-food").click(function (e) {
        e.preventDefault();
        var id = null
        const path = (window.location.search.split(''))
        for (var i = 0; i < path.length; i++) {
            if (path[i] === '=') {
                id = path.splice(i + 1, path.length).join('')
            }
        }
        const table_order_id = id
        const food_idDiv = document.querySelectorAll(".ibox select")
        const orderArrs = []
        const today = new Date();
        const time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes()
        for (let i of food_idDiv) {
            const parentEl = getParent(i, ".ibox-content")
            const addNumber = parentEl.querySelector(".product-number-add").value
            const deleteNumber = parentEl.querySelector(".product-number-delete").value
            const order_idDiv = parentEl.querySelector(".order-id")
            let order_id = null
            if (order_idDiv) {
                order_id = order_idDiv.innerText
            }
            if (addNumber > 0 && deleteNumber > 0) {
                errorFunction("Vui lòng chỉ nhập số lượng thêm hoặc xóa")
            }
            else if (addNumber || deleteNumber) {
                orderArrs.push(
                    {
                        order_id,
                        table_order_id,
                        food_id: i.value,
                        addNumber,
                        deleteNumber,
                        time
                    }
                )
            }
            else {
                if (i.classList.contains("update")) {
                    continue
                }
                else {
                    errorFunction("Vui lòng nhập số lượng")
                    break
                }
            }
        }
        if (orderArrs.length > 0) {
            $.ajax({
                type: "POST",
                url: "http://localhost:3333/api/admins/order/create",
                data: { orderArrs },
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

function resetOption() {
    localStorage.setItem('numberOpt', 0);
}

function renderLogs(id) {
    const logsDiv = document.querySelector(".ibox-logs .ibox-content")
    let htmls = ''
    $.ajax({
        async: false,
        type: "GET",
        url: `http://localhost:3333/api/admins/logs/${id}&Orders`,
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            for (let log of data.logs) {
                htmls += `
                <span class="text-muted log">
                    ${log.logs}
                </span>`
            }
        }
    });
    logsDiv.innerHTML = htmls
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
            resetOption()
            getMenu()
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