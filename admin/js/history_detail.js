$(document).ready(function () {
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
    $.ajax({
        type: "GET",
        url: `http://localhost:3333/api/admins/order/show/${id}`,
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            renderMenu(data.orderArr)
            renderLogs(id)
            pay(id, data.table_id)
            totalPrice()
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
        htmls += `
        <div class="ibox-content ibox-content-history item">
            <div class="table-responsive">
                <table class="table shoping-cart-table">
                    <tbody>
                    <tr>
                        <td width="90">
                            <div class="cart-product-imitation">
                            <img style = "width:90%" src="${order.food.img}" alt="">
                            </div>
                        </td>
                        <select class = "product hide " name="" id="">
                            <option  data-price = "${order.food.price}" value="${order.food.id}"></option>
                        </select>
                        <td class="desc">
                            <h3>
                            <a href="#" class="text-navy">
                            ${order.food.name.toUpperCase()}
                            </a>
                            </h3>
                            <p class="">
                               Số lượng còn lại: ${order.food.number}
                            </p>
                            <p class="order-id hide">${order.order.id}
                            </p>
                            <p class="">
                               Số lượng đã chọn: ${order.order.number}
                            </p>
                        </td>
                        <td class = "fee">
                            <h3>Chi phí</h3>
                            <h4 class = "im-price">
                                <i class="fa fa-money" style = "padding-right:5px"></i> Giá nhập: ${order.food.im_price}
                            </h4>
                            <h4 class = "price">
                                <i class="fa fa-money" style = "padding-right:5px"></i> Giá bán: ${order.food.price}
                            </h4>
                            <h4 class = "total-im-price hide">
                                <i class="fa fa-money" style = "padding-right:5px"></i> Tổng tiền nhập:  ${order.food.im_price * order.order.number}
                            </h4>
                            <h4 class = "total-price-product">
                                <i class="fa fa-money" style = "padding-right:5px"></i> Tổng tiền: ${order.food.price * order.order.number}
                            </h4>
                            <h4 class = "profit-product">
                                <i class="fa fa-money" style = "padding-right:5px"></i> Lợi nhuận: ${(order.food.price * order.order.number) - (order.food.im_price * order.order.number)}
                            </h4>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
            `
    }
    orderGrid.innerHTML = htmls
}
function totalPrice() {
    const billDiv = document.querySelector(".bill")
    const totalPrice = document.querySelectorAll(".total-price-product")
    const totalImPrice = document.querySelectorAll(".total-im-price")
    const profit = document.querySelectorAll(".profit-product")
    let countTotalPrice = 0
    let countTotalImPrice = 0
    let countprofit = 0
    if (totalPrice) {
        for (let i = 0; i < totalPrice.length; i++) {
            countTotalPrice += handlePriceToCal(totalPrice[i])
            countTotalImPrice += handlePriceToCal(totalImPrice[i])
            countprofit += handlePriceToCal(profit[i])
        }
    }
    billDiv.innerHTML = `
    <h4><i class="fa fa-money" style = "padding-right:5px"></i>Tổng tiền: ${countTotalPrice}</h3>
    <h4><i class="fa fa-money" style = "padding-right:5px"></i>Tiền gốc: ${countTotalImPrice}</h3>
    <h4><i class="fa fa-money" style = "padding-right:5px"></i>Lợi nhuận: ${countprofit}</h3>
    `
}

function pay(toId, table_id) {
    $(".btn-pay").click(function (e) {
        e.preventDefault();
        const item = document.querySelectorAll(".ibox-content.item")
        if (item.length > 0) {
            var today = new Date();
            var time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes()
            $.ajax({
                type: "PUT",
                url: `http://localhost:3333/api/admins/table_order/pay/${toId}&${table_id}&${time}&${time}`,
                dataType: "json",
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
            errorFunction("Vui lòng thêm sản phẩm")
        }

    });
}





function handlePriceToCal(price) {
    let handledprice = price.innerText.split(":")
    return Number(handledprice[handledprice.length - 1])

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
            window.open(`/admin/table.html`)
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