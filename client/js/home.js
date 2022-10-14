$(document).ready(function () {
    tableBooking()
    renderMenu()
});


function tableBooking() {
    getDate()
    getTime()
    getInfor()
}

function renderMenu() {
    const menuContainer = document.querySelector(".tab-content")
    let menu = null
    $.ajax({
        async: false,
        type: "GET",
        url: "http://localhost:3333/api/admins/menu",
        dataType: "json",
        success: function (data) {
            menu = data.menu
        }
    });
    const mainFood = []
    const sideFood = []
    const drink = []
    if (menu) {
        for (let food of menu) {
            if (food.type == 1) {
                mainFood.push(food)
            }
            else if (food.type == 2) {
                sideFood.push(food)
            }
            else if (food.type == 3) {
                drink.push(food)
            }
        }
        const navContainer = document.querySelector(".nav")
        const tabContainer = document.querySelector(".tab-content")
        let tabCount = 1
        if (mainFood.length > 0) {
            //render nav
            const nav = document.createElement("li")
            nav.classList.add('nav-item')
            const checkNav = document.querySelector(".nav-item .active")
            if (!checkNav) {
                nav.innerHTML = `
                <a class="d-flex align-items-center text-start mx-3 pb-3 active" data-bs-toggle="pill" href="#tab-1">
                    <i class="fa fa-hamburger fa-2x text-primary"></i>
                    <div class="ps-3">
                        <small class="text-body">Đặc biệt</small>
                        <h6 class="mt-n1 mb-0">Món chính</h6>
                    </div>
                </a>
                `
            }
            else {
                nav.innerHTML = `
                <a class="d-flex align-items-center text-start mx-3 pb-3" data-bs-toggle="pill" href="#tab-1">
                    <i class="fa fa-hamburger fa-2x text-primary"></i>
                    <div class="ps-3">
                        <small class="text-body">Đặc biệt</small>
                        <h6 class="mt-n1 mb-0">Món chính</h6>
                    </div>
                </a>
                `
            }

            navContainer.appendChild(nav)
            //render tab
            const tabContent = document.createElement('div')
            const check = tabContainer.querySelector('.tab-pane.active')
            if (!check) {
                tabContent.classList.add("tab-pane", "fade", "show", "p-0", 'active')
            }
            else {
                tabContent.classList.add("tab-pane", "fade", "show", "p-0")
            }
            tabContent.setAttribute("id", `tab-${tabCount}`);
            tabCount++
            const row = document.createElement('div')
            row.classList.add("row", "g-4")
            //render menu
            for (let food of mainFood) {
                const foodMenu = document.createElement('div')
                foodMenu.classList.add("col-lg-6")
                foodMenu.innerHTML = `
            <div class="d-flex align-items-center">
                <img class="flex-shrink-0 img-fluid rounded" src="${food.img}" alt="" style="width: 80px;">
                <div class="w-100 d-flex flex-column text-start ps-4">
                    <h5 class="d-flex justify-content-between border-bottom pb-2">
                        <span>${food.name}</span>
                        <span class="text-primary">${food.price}</span>
                    </h5>
                    <small class="fst-italic">Ipsum ipsum clita erat amet dolor justo diam</small>
                </div>
            </div> `
                row.appendChild(foodMenu)
            }
            tabContent.appendChild(row)
            tabContainer.appendChild(tabContent)

        }
        if (sideFood.length > 0) {
            //render nav
            const nav = document.createElement("li")
            nav.classList.add('nav-item')
            const checkNav = document.querySelector(".nav-item .active")
            if (!checkNav) {
                nav.innerHTML = `
                <a class="d-flex align-items-center text-start mx-3 pb-3 active" data-bs-toggle="pill" href="#tab-2">
                <i class="fa fa-utensils fa-2x text-primary"></i>
                <div class="ps-3">
                    <small class="text-body">Yêu thích</small>
                    <h6 class="mt-n1 mb-0">Món phụ</h6>
                </div>
            </a>
            `
            }
            else {
                nav.innerHTML = `
                <a class="d-flex align-items-center text-start mx-3 pb-3" data-bs-toggle="pill" href="#tab-2">
                <i class="fa fa-utensils fa-2x text-primary"></i>
                <div class="ps-3">
                    <small class="text-body">Yêu thích</small>
                    <h6 class="mt-n1 mb-0">Món phụ</h6>
                </div>
            </a>
            `
            }
            navContainer.appendChild(nav)
            //render tab
            const tabContent = document.createElement('div')
            const check = tabContainer.querySelector('.tab-pane.active')

            if (!check) {
                tabContent.classList.add("tab-pane", "fade", "show", "p-0", 'active')
            }
            else {
                tabContent.classList.add("tab-pane", "fade", "show", "p-0")
            }
            tabContent.setAttribute("id", `tab-2`);
            tabCount++
            const row = document.createElement('div')
            row.classList.add("row", "g-4")
            //render menu
            for (let food of sideFood) {
                const foodMenu = document.createElement('div')
                foodMenu.classList.add("col-lg-6")
                foodMenu.innerHTML = `
            <div class="d-flex align-items-center">
                <img class="flex-shrink-0 img-fluid rounded" src="${food.img}" alt="" style="width: 80px;">
                <div class="w-100 d-flex flex-column text-start ps-4">
                    <h5 class="d-flex justify-content-between border-bottom pb-2">
                        <span>${food.name}</span>
                        <span class="text-primary">${food.price}</span>
                    </h5>
                    <small class="fst-italic">Ipsum ipsum clita erat amet dolor justo diam</small>
                </div>
            </div> `
                row.appendChild(foodMenu)
            }
            tabContent.appendChild(row)
            tabContainer.appendChild(tabContent)

        }
        if (drink.length > 0) {
            //render nav
            const nav = document.createElement("li")
            nav.classList.add('nav-item')
            const checkNav = document.querySelector(".nav-item .active")
            if (!checkNav) {
                nav.innerHTML = `
                <a class="d-flex align-items-center text-start mx-3 ms-0 pb-3 active " data-bs-toggle="pill" href="#tab-3">
                    <i class="fa fa-coffee fa-2x text-primary"></i>
                    <div class="ps-3">
                        <small class="text-body">Phổ biến</small>
                        <h6 class="mt-n1 mb-0">Đồ Uống</h6>
                    </div>
                </a>
                    `
            }
            else {
                nav.innerHTML = `
                <a class="d-flex align-items-center text-start mx-3 ms-0 pb-3 " data-bs-toggle="pill" href="#tab-3">
                    <i class="fa fa-coffee fa-2x text-primary"></i>
                    <div class="ps-3">
                        <small class="text-body">Phổ biến</small>
                        <h6 class="mt-n1 mb-0">Đồ Uống</h6>
                    </div>
                </a>
                    `
            }
            navContainer.appendChild(nav)
            //render tab
            const tabContent = document.createElement('div')
            const check = tabContainer.querySelector('.tab-pane.active')
            if (!check) {
                tabContent.classList.add("tab-pane", "fade", "show", "p-0", 'active')
            }
            else {
                tabContent.classList.add("tab-pane", "fade", "show", "p-0")
            }
            tabContent.setAttribute("id", `tab-3`);
            tabCount++
            const row = document.createElement('div')
            row.classList.add("row", "g-4")
            //render menu
            for (let food of drink) {
                const foodMenu = document.createElement('div')
                foodMenu.classList.add("col-lg-6")
                foodMenu.innerHTML = `
            <div class="d-flex align-items-center">
                <img class="flex-shrink-0 img-fluid rounded" src="${food.img}" alt="" style="width: 80px;">
                <div class="w-100 d-flex flex-column text-start ps-4">
                    <h5 class="d-flex justify-content-between border-bottom pb-2">
                        <span>${food.name}</span>
                        <span class="text-primary">${food.price}</span>
                    </h5>
                    <small class="fst-italic">Ipsum ipsum clita erat amet dolor justo diam</small>
                </div>
            </div> `
                row.appendChild(foodMenu)
            }
            tabContent.appendChild(row)
            tabContainer.appendChild(tabContent)
        }

    }


}


function getDate(idOfTO) {
    let today = new Date();
    $('#date-input').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD'
        },
        singleDatePicker: true,
        showDropdowns: true,
        minYear: today.getFullYear(),
        maxYear: parseInt(moment().format('YYYY'), 10)
    }, function (start, end, label) {
    });
}
function getTime() {
    $('#time-input').timepicker({
        timeFormat: 'HH:mm',
        interval: 60,
        minTime: '8',
        maxTime: '22:00',
        defaultTime: '8:00',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });
}
function getInfor() {
    const notice = document.querySelector(".notice")
    if (localStorage.getItem("accessToken")) {
        $.ajax({
            url: "http://localhost:3333/api/users/home",
            type: "GET",
            dataType: 'json',
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessToken"),
            },
            success: function (data) {
                const userName = document.querySelector("#name")
                const phoneNumber = document.querySelector("#phone-number")
                userName.classList.add("hide")
                phoneNumber.classList.add("hide")
                userName.value = data.user.name
                phoneNumber.value = data.user.phonenumber
                const user_id = data.user.id
                $(".btn-order").click(function (e) {
                    e.preventDefault();
                    const date = document.querySelector("#date-input").value
                    const time = document.querySelector("#time-input").value
                    const quantity = document.querySelector("#number-people").value
                    let specialRequest = document.querySelector("#message").value
                    if (quantity) {
                        if (!specialRequest) {
                            specialRequest = ' '
                        }
                        $.ajax({
                            type: "POST",
                            url: "http://localhost:3333/api/users/requesttable",
                            data: {
                                userName: userName.value,
                                user_id: data.user.id,
                                phoneNumber: phoneNumber.value,
                                time: `${date}` + ' ' + `${time}`,
                                quantity,
                                specialRequest
                            },
                            dataType: "json",
                            success: function (data) {
                                notice.classList.remove('hide')
                                notice.innerText = `${data.msg}`
                                notice.style.color = "rgb(5, 211, 5)"
                            },
                            error: function (err) {
                                notice.classList.remove('hide')
                                notice.innerText = `${err.responseJSON.msg}`
                                notice.style.color = "red"
                            }
                        });
                    }
                    else {
                        notice.classList.remove('hide')
                        notice.innerText = "Vui lòng nhập đủ thông tin"
                        notice.style.color = "red"
                    }
                });
            }
        })

    }
    else {
        $(".btn-order").click(function (e) {
            e.preventDefault();
            const userName = document.querySelector("#name").value
            const phoneNumber = document.querySelector("#phone-number").value
            const date = document.querySelector("#date-input").value
            const time = document.querySelector("#time-input").value
            const quantity = document.querySelector("#number-people").value
            let specialRequest = document.querySelector("#message").value
            if (userName && phoneNumber && quantity) {
                if (!specialRequest) {
                    specialRequest = ' '
                }
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3333/api/users/requesttable",
                    data: {
                        userName,
                        user_id: 0,
                        phoneNumber,
                        time: `${date}` + ' ' + `${time}`,
                        quantity,
                        specialRequest
                    },
                    dataType: "json",
                    success: function (data) {
                        notice.classList.remove('hide')
                        notice.innerText = `${data.msg}`
                        notice.style.color = "rgb(5, 211, 5)"
                    },
                    error: function (err) {
                        notice.classList.remove('hide')
                        notice.innerText = `${err.responseJSON.msg}`
                        notice.style.color = "red"

                    }
                });
            }
            else {
                notice.classList.remove('hide')
                notice.innerText = "Vui lòng nhập đủ thông tin"
                notice.style.color = "red"
            }

        });

    }
    $(".form-floating").click(function (e) {
        e.preventDefault();
        if (!notice.classList.contains("hide")) {
            notice.classList.add('hide')
        }
    });

}
// ------toast---------------
import toast from "../toastResource/toast.js"
function successFunction(data) {
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