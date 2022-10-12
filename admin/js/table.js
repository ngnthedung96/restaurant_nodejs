$(document).ready(function () {
    renderTable()
});

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

function renderTableDetail(data, idOfTO) {
    const theadDiv = document.querySelector(".table thead tr")
    if (data.permission === 2) {
        theadDiv.innerHTML = `
            <th>#</th>
            <th>Tên Bàn</th>
            <th>Trạng thái bàn</th>
            <th></th>
        `
    }
    else if (data.permission <= 1) {
        theadDiv.innerHTML = `
            <th>#</th>
            <th>Tên Bàn</th>
            <th>Trạng thái bàn</th>
            <th></th>
        `
    }

    var htmls = ''
    var count = 1
    const tableDiv = document.querySelector(".table tbody")
    for (var table of data.tables) {
        if (data.permission === 2) {
            if (table.status === -1) {
                htmls += `
        <tr>
            <td>${count}</td>
            <td class = 'id hide'>${table.id}</td>
            <td class = 'name'>${table.name}</td>
            <td class = 'status'>Bàn Trống</td>
            <td></td>
            </tr>`
                count++
            }
            else if (table.status === 0) {
                htmls += `
        <tr>
            <td>${count}</td>
            <td class = 'id hide'>${table.id}</td>
            <td class = 'name'>${table.name}</td>
            <td class = 'status'>Bàn Đã Được Đặt</td>
            <td></td>

        </tr>`
                count++
            }
            else {
                var idOfTO = null
                $.ajax({
                    async: false,
                    type: "GET",
                    url: `http://localhost:3333/api/admins/table_order/getId/${table.id}`,
                    dataType: "json",
                    headers: {
                        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
                    },
                    success: function (data) {
                        idOfTO = data.table_order.id
                    }
                });
                htmls += `
        <tr>
            <td>${count}</td>
            <td class = 'id hide'>${table.id}</td>
            <td class = 'idOfTO hide'>${idOfTO}</td>
            <td class = 'name'>${table.name}</td>
            <td class = 'status'>Bàn Đang Được Sử Dụng</td>
            <td class = 'button'>
            <button type="button" class="btn btn-outline-primary btn-order">Gọi Món</button></td>
            <td></td>
        </tr>`
                count++
            }

        }
        if (data.permission <= 1) {
            if (table.status === -1) {
                htmls += `
        <tr>
            <td>${count}</td>
            <td class = 'id hide'>${table.id}</td>
            <td class = 'name'>${table.name}</td>
            <td class = 'status'>Bàn Trống</td>
            <td class = 'button'><button type="button" class="btn btn-outline-primary btn-order-table">Đặt bàn</button></td>
        </tr>`
                count++
            }
            else if (table.status === 0) {
                htmls += `
        <tr>
            <td>${count}</td>
            <td class = 'id hide'>${table.id}</td>
            <td class = 'name'>${table.name}</td>
            <td class = 'status'>Bàn Đã Được Đặt</td>
            <td class = 'button'>
            <button type="button" class="btn btn-outline-danger btn-delete-table">Hủy đặt bàn</button>
            <button type="button" class="btn btn-outline-success btn-open-modal" data-toggle="modal" data-target="#userModal">Sử dụng bàn</button>
            </td>
            </tr>`
                count++
            }
            else {
                var idOfTO = null
                $.ajax({
                    async: false,
                    type: "GET",
                    url: `http://localhost:3333/api/admins/table_order/getId/${table.id}`,
                    dataType: "json",
                    headers: {
                        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
                    },
                    success: function (data) {
                        idOfTO = data.table_order.id
                    }
                });
                if (idOfTO) {
                    htmls += `
                    <tr>
                        <td>${count}</td>
                        <td class = 'id hide'>${table.id}</td>
                        <td class = 'idOfTO hide'>${idOfTO}</td>
                        <td class = 'name'>${table.name}</td>
                        <td class = 'status'>Bàn Đang Được Sử Dụng</td>
                        <td class = 'button'>
                        <button type="button" class="btn btn-outline-danger btn-delete-used-table">Hủy sử dụng bàn</button>
                        <button type="button" class="btn btn-outline-success btn-pay-table">Thanh toán</button>
                        </td>
                        </tr>`
                    count++
                }
                else {
                    htmls += `
                    <tr>
                        <td>${count}</td>
                        <td class = 'id hide'>${table.id}</td>
                        <td class = 'name'>${table.name}</td>
                        <td class = 'status'>Bàn Đang Được Sử Dụng</td>
                        <td class = 'button'>
                        <button type="button" class="btn btn-outline-danger btn-delete-used-table">Hủy sử dụng bàn</button>
                        <button type="button" class="btn btn-outline-success btn-pay-table">Thanh toán</button>
                        </td>
                        </tr>`
                    count++
                }
            }

        }

    }
    tableDiv.innerHTML = htmls
}

function orderTable() {
    $(".btn-order-table").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(this, "tr")
        const id = parentEl.querySelector(".id").innerText
        e.preventDefault();
        $.ajax({
            type: "PUT",
            url: `http://localhost:3333/api/admins/table_order/order/${Number(id)}`,
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
function deleteOrderTable() {
    $(".btn-delete-table").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(this, "tr")
        const id = parentEl.querySelector(".id").innerText
        e.preventDefault();
        $.ajax({
            type: "PUT",
            url: `http://localhost:3333/api/admins/table_order/deleteOrder/${Number(id)}`,
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
function openModal() {
    $(".btn-open-modal").click(function (e) {
        e.preventDefault();
        let userId = null
        $('.select-user').select2();
        const parentEl = getParent(this, "tr")
        const id = parentEl.querySelector(".id").innerText
        const selectTypeUser = document.querySelector("#userModal .choose-user .select-type-user")
        const searchUser = document.querySelector("#userModal .search-user")
        const searchUserDiv = searchUser.querySelector(".user")

        const selectUserDiv = searchUser.querySelector(".select-user")
        selectTypeUser.value = 0
        searchUser.classList.add("hide")
        // inputPhoneNumber.value = ''
        searchUserDiv.innerHTML = `
        <p class = "table-id hide">${id}</p>
        `
        $(selectTypeUser).unbind()
        $(selectTypeUser).click(function (e) {
            e.preventDefault();
            if (Number(selectTypeUser.value) !== 0) {
                searchUser.classList.remove("hide")
                $.ajax({
                    type: "GET",
                    url: "http://localhost:3333/api/users/findusers",
                    dataType: "json",
                    headers: {
                        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
                    },
                    success: function (data) {
                        let html = '<option disabled selected>Tìm kiếm bằng số điện thoại</option>'
                        for (let user of data.user) {
                            html += `
                            <option value="${user.id}"><span>Tên khách hàng: ${user.name}</span> Số điện thoại: ${user.phonenumber}</option>
                            `
                            selectUserDiv.innerHTML = html
                        }

                    }
                });
            }
        });
        $(document.body).on("change", "#userModal .search-user .select-user", function () {
            searchUserDiv.innerHTML = `
            <p class = "table-id hide">${id}</p>
            <p class = "user-id hide">${this.value}</p>
            `
        });

    });
}


function usedTable() {
    $(".btn-used-table").unbind()
    $(".btn-used-table").click(function (e) {
        const parentEl = getParent(e.target, "#userModal")
        const user_idDiv = parentEl.querySelector(".user-id")
        let user_id = null
        if (user_idDiv) {
            user_id = Number(user_idDiv.innerText)
        }
        const table_id = Number(parentEl.querySelector(".table-id").innerText)
        var today = new Date();
        var time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes()
        e.preventDefault();
        if (user_id) {
            $.ajax({
                type: "POST",
                url: "http://localhost:3333/api/admins/table_order/used/",
                data: {
                    table_id,
                    user_id,
                    timeIn: time
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
        else {
            $.ajax({
                type: "POST",
                url: "http://localhost:3333/api/admins/table_order/used",
                data: {
                    table_id,
                    timeIn: time
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

function deleteUsedTable() {
    $(".btn-delete-used-table").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(this, "tr")
        const id = parentEl.querySelector(".id").innerText
        const toId = parentEl.querySelector(".idOfTO").innerText
        var today = new Date();
        var time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes()
        console.log(toId)
        e.preventDefault();
        $.ajax({
            type: "PUT",
            url: `http://localhost:3333/api/admins/table_order/deleteUsed/${toId}&${Number(id)}&${time}`,
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
function pay() {
    $(".btn-pay-table").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(this, "tr")
        const id = parentEl.querySelector(".id").innerText
        const toId = parentEl.querySelector(".idOfTO").innerText
        window.open(`/admin/table_orders.html?idOfTO=${toId}`)
    });
}


function orderFood() {
    $(".btn-order").click(function (e) {
        e.preventDefault();
        const parentEl = getParent(this, "tr")
        const toId = parentEl.querySelector(".idOfTO").innerText
        window.open(`/admin/orders.html?idOfTO=${toId}`)
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
        setTimeout(() => {
            renderTable()
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