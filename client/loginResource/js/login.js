$(document).ready(function () {
    login()
});

function login() {
    const phoneNumberInput = document.querySelector(".phonenumber-input")
    const passwordInput = document.querySelector(".password-input")
    $(".post-btn").click(function (e) {
        console.log(1)
        e.preventDefault();
        const phoneNumber = phoneNumberInput.value
        const password = passwordInput.value
        const AllInput = document.querySelectorAll(".input100")
        const errBlock = document.querySelector(".error p")
        for (var input of AllInput) {
            input.addEventListener("input", function () {
                errBlock.innerText = ""
            })
        }
        $.ajax({
            type: "POST",
            url: "http://localhost:3333/api/users/login",
            data: {
                phonenumber: phoneNumber,
                password: password
            },
            dataType: "json",
            success: function (data) {
                localStorage.setItem('accessToken', data.accesstoken);
                setTimeout(function () {
                    window.close()
                    window.open('/client/index.html')
                }, 1500)
            },
            error: function (data) {
                const err = data.responseJSON.errors[0].msg
                errBlock.innerText = err
            }
        });
    });

}

