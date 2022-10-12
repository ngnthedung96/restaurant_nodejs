$(document).ready(function () {
    register()
});

function register() {
    const phoneNumberInput = document.querySelector(".phonenumber-input")
    const passwordInput = document.querySelector(".password-input")
    const emailInput = document.querySelector(".email-input")
    const nameInput = document.querySelector(".name-input")
    const genderInput = document.querySelector(".gender-input")
    const dateOfBirthInput = document.querySelector(".dateOfBirth-input")
    const AllInput = document.querySelectorAll(".input100")
    const errBlock = document.querySelector(".error p")
    for (var input of AllInput) {
        input.addEventListener("input", function () {
            errBlock.innerText = ""
        })
    }
    $(".post-btn").click(function (e) {
        e.preventDefault();
        const phoneNumber = phoneNumberInput.value
        const password = passwordInput.value
        const email = emailInput.value
        const name = nameInput.value
        const gender = genderInput.value
        const dateOfBirth = dateOfBirthInput.value
        $.ajax({
            type: "POST",
            url: "http://localhost:3333/api/users/register",
            data: {
                phonenumber: phoneNumber,
                password: password,
                email: email,
                name: name,
                gender: gender,
                dateOfBirth: dateOfBirth
            },
            dataType: "json",
            success: function (data) {
                setTimeout(function () {
                    window.close()
                    window.open('/client/login.html')
                }, 1500)
            },
            error: function (data) {
                const err = data.responseJSON.errors[0].msg
                errBlock.innerText = err
            }
        });

    });

}

