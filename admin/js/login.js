$(document).ready(function () {
    login()
});

function login() {
    const phonenumberInput = document.querySelector(".phonenumber-input")
    const passwordInput = document.querySelector(".password-input")
    const AllInput = document.querySelectorAll(".form-group input")
    const errBlock = document.querySelector(".error p")
    for (var input of AllInput) {
        input.addEventListener("input", function () {
            errBlock.innerText = ""
        })
    }
    $(".post-btn").click(function (e) {
        e.preventDefault();
        const phoneNumber = phonenumberInput.value
        const password = passwordInput.value
        $.ajax({
            type: "POST",
            url: "http://localhost:3333/api/admins/login",
            data: {
                phonenumber: phoneNumber,
                password
            },
            dataType: "json",
            success: function (data) {
                if (data.admin.permission >= 1) {
                    setTimeout(function () {
                        window.close()
                        localStorage.setItem('accessAdminToken', data.accessAdmintoken);
                        window.open('/admin/table.html')
                    }, 1500)
                }
                else {
                    setTimeout(function () {
                        window.close()
                        localStorage.setItem('accessAdminToken', data.accessAdmintoken);
                        window.open('/admin/index.html')
                    }, 1500)
                }
            },
            error: function (data) {
                const err = data.responseJSON.errors[0].msg
                errBlock.innerText = err
            }
        });

    });

}