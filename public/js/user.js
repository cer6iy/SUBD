//login functions


$("#exit").click(function (event) {

    event.preventDefault();
    /*  sign out*/
    alert("Logging out..");

    /*    send to server*/

    $.ajax({
        type: 'POST',
        url: '/logout',
        data: { },
        success: function (msg) {
            if (msg == "1") {
                window.location.replace("/");
            } else {
                alert("Error");
            }
        }

    });


})

/*Fill account*/
fillAccount = function(event){
    event.preventDefault();

    var summ = $("#summ").val(),
        id = $("#userId").val();

    $.ajax({
        type: 'POST',
        url: '/user/account',
        data: {
            summ: summ,
            user_id: id
        },
        success: function (msg) {
            $('#fillAccountModal').modal('hide');
            if (msg.status == "1") {
                $('#userAccount').html(msg.account);
                $('#fillAccountSuccesstModal').modal('show');
            } else {
                alert("Error");
            }
        }

    });
}

$("#fillAccount").click(fillAccount)