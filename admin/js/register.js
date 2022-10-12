$(document).ready(function () {
    register()
});

function register() {
    const phonenumberInput = document.querySelector(".phonenumber-input")
    const passwordInput = document.querySelector(".password-input")
    const nameInput = document.querySelector(".name-input")
    const shiftInput = document.querySelector(".shift-input")
    const emailInput = document.querySelector(".email-input")
    const salaryInput = document.querySelector(".salary-input")
    const permissionInput = document.querySelector(".permission-input")
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
        const name = nameInput.value
        const salary = salaryInput.value
        const email = emailInput.value
        const permission = permissionInput.value
        const shift = shiftInput.value



        $.ajax({
            type: "POST",
            url: "http://localhost:3333/api/admins/register",
            data: {
                phonenumber: phoneNumber,
                password,
                name,
                email,
                shift,
                salary_hour: salary,
                permission
            },
            dataType: "json",
            success: function (data) {
                setTimeout(function () {
                    window.close()
                    window.open('/admin/table_admins.html')
                }, 1000)
            },
            error: function (data) {
                const err = data.responseJSON.errors[0].msg
                errBlock.innerText = err
            }
        });

    });

}