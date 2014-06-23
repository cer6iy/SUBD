//login
function login(event) {
    event.preventDefault();

    /*      take auth & password*/
    var login = $("#username").val(),
        pass = $("#password").val();


    /*      send to server*/
    $.ajax({
        type: 'POST',
        url: '/login',
        data: {
            username: login,
            password: pass
        },
        success: function (msg) {
            if (msg == "1") {
                window.location.replace("/user");
            } else {
                alert("Error");
            }
        }

    })

}

$("#login").click(login);
$("#login-form").submit(login);

//sign up

var signUp = function (event) {
    event.preventDefault();

    /*      take e-mail*/
    var mail = $('#mail').val();

    /*      send to server*/
    $.ajax({
        type: 'POST',
        url: '/user/new',
        data: {
            mail: mail
        },
        success: function (msg) {
            if (msg != "0") {
                window.location.replace("/user/show/" + msg);
            } else {
                alert("Данный E-mail уже зарегистрирован!");
            }
        }

    })
}
$('#send').click(signUp);
$("#signUp-form").submit(signUp);