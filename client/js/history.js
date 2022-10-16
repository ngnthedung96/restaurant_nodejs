$(document).ready(function () {
    selectTimeToGet()
});

function getTime(start, end) {
    $('#order-sort span').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'));
    if (localStorage.getItem("accessToken")) {
        $.ajax({
            url: `http://localhost:3333/api/users/requesttable/show/${start.format('YYYY-MM-DD HH:mm')}&${end.format('YYYY-MM-DD HH:mm')}`,
            type: "GET",
            dataType: 'json',
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessToken"),
            },
            success: function (data) {
                renderRequest(data)
                deleteRequest()
            }
        })
    }

}
function selectTimeToGet() {
    let start = moment().startOf('day');
    let end = moment().endOf('day');
    $('#order-sort').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment().startOf('day'), moment().endOf('day')],
            'Yesterday': [moment().subtract(1, 'days'), moment()],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, getTime);
    getTime(start, end);
}
function renderRequest(data) {
    const table_request = document.querySelector('.table-request tbody')
    table_request.innerHTML = ''
    let count = 1
    for (let request of data.requests) {
        const tr = document.createElement('tr')
        if (request.status == 0) {
            tr.innerHTML = `
        <td>${count}</td>
        <td class = "id hide">${request.id}</td>
        <td>${request.phonenumber}</td>
        <td>${request.username}</td>
        <td>${request.quantity}</td>
        <td>${request.special_request}</td>
        <td>${moment.unix(request.time).format('HH:mm DD-MM-YYYY ')}</td>
        <td>${moment(request.createdAt).format('HH:mm DD-MM-YYYY')}</td>
        <td><p style ="color:blue" >Đang xử lý</p></td>        
        <td><button type="button" class="btn btn-outline-danger btn-delete-table">Hủy đặt bàn</button></td>        
        `
        }
        else if (request.status == 1) {
            tr.innerHTML = `
        <td>${count}</td>
        <td>${request.phonenumber}</td>
        <td>${request.username}</td>
        <td>${request.quantity}</td>
        <td>${request.special_request}</td>
        <td>${moment.unix(request.time).format('HH:mm DD-MM-YYYY ')}</td>
        <td>${moment(request.createdAt).format('HH:mm DD-MM-YYYY')}</td>
        <td><p style ="color:green" >Đặt bàn thành công</p></td>        
        <td></td>        
        `
        }
        else if (request.status == -2) {
            tr.innerHTML = `
        <td>${count}</td>
        <td>${request.phonenumber}</td>
        <td>${request.username}</td>
        <td>${request.quantity}</td>
        <td>${request.special_request}</td>
        <td>${moment.unix(request.time).format('HH:mm DD-MM-YYYY ')}</td>
        <td>${moment(request.createdAt).format('HH:mm DD-MM-YYYY')}</td>
        <td><p style ="color:red" >Đã hủy đặt bàn</p></td>   
        <td></td>   
        `
        }
        else {
            tr.innerHTML = `
        <td>${count}</td>
        <td>${request.phonenumber}</td>
        <td>${request.username}</td>
        <td>${request.quantity}</td>
        <td>${request.special_request}</td>
        <td>${moment.unix(request.time).format('HH:mm DD-MM-YYYY ')}</td>
        <td>${moment(request.createdAt).format('HH:mm DD-MM-YYYY')}</td>
        <td><p style ="color:red">Đã hết bàn</p></td>               
        <td></td>               
        `
        }


        table_request.appendChild(tr)
        count++
    }
}
function deleteRequest() {
    $(".btn-delete-table").click(function (e) {
        e.preventDefault();
        const id = document.querySelector(".id").innerText
        $.ajax({
            type: "PUT",
            url: `http://localhost:3333/api/users/requesttable/changeRequest/${id}`,
            dataType: "json",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessToken"),
            },
            success: function (data) {
                successFunction(data)
                selectTimeToGet()
            },
            error: function (err) {
                errorFunction(err.responseJSON.msg)
            }
        });
    });
}
// ------toast---------------
import toast from "../toastResource/toast.js"
function successFunction(data, check) {
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
