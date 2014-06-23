//login functions


$("#save").click(function (event) {

    event.preventDefault();

    var pass = $('#password').val(),
        passConf = $('#confirmPassword').val(),
        firstName = $('#firstname').val(),
        lastName = $('#lastname').val(),
        token = $('#token').val();

    alert(token);
    /*  checking*/

    if (pass === passConf) {
        alert("User will be saved..");
        if (token) {
            /*    send to server*/
            $.ajax({
                type: 'POST',
                url: '/user/create',
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    password: pass,
                    token: token
                },
                success: function (msg) {
                    if (msg == "1") {
                        window.location.replace("/");
                    } else {
                        alert("Error");
                    }
                }

            });
        }
    } else {
        alert("Fill the password field.");
    }

});