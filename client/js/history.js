$(document).ready(function () {
    getDataTable()
});
function getDataTable() {
    if (localStorage.getItem("accessToken")) {
        console.log(1)
        $.ajax({
            url: "http://localhost:3333/api/users/requesttable/show",
            type: "GET",
            dataType: 'json',
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessToken"),
            },
            success: function (data) {
                renderRequest(data)
            }
        })
    }
}

function renderRequest(data) {
    console.log(data)
    const table_request = document.querySelector('.table-request tbody')
    let count = 1
    for (let request of data.requests) {
        let requestStatus = null
        if (request.status == 0) {
            requestStatus = 'Đang xử lý'
        }
        else if (request.status == 1) {
            requestStatus = 'Đặt bàn thành công'
        }
        else {
            requestStatus = 'Đã hết bàn'
        }
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td>${count}</td>
        <td>${request.phonenumber}</td>
        <td>${request.username}</td>
        <td>${request.quantity}</td>
        <td>${request.special_request}</td>
        <td>${moment.unix(request.time).format('HH:mm DD-MM-YYYY ')}</td>
        <td>${moment(request.createdAt).format('HH:mm DD-MM-YYYY')}</td>
        <td>${requestStatus}</td>        
        `
        table_request.appendChild(tr)
        count++
    }
}
