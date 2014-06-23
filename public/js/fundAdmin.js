
var doPayout = function (event) {
    event.preventDefault();
    alert("Pressed payout");
    $.ajax({
        type: 'POST',
        url: '/fund/payout',
        data: {
            fundId: data.fund._id
        },
        success: function (msg) {
            if (msg.status == 1) {
                alert("Done, press F5");
            } else {
                alert("Error");
            }
        }
    })
}
/*
 $('#payout').click(doPayout)*/

var saveReport = function (event) {

    event.preventDefault();

    alert("Sendin report info");
    var description = $("#description").val();

    alert(description);
    $.ajax({
        type: 'POST',
        url: '/fund/report/new',
        data: {
            fundId: $('#fundId').val(),
            description: description
        },
        success: function (msg) {
            if (msg.status == 1) {
                alert("Done");
            } else {
                alert("Error");
            }
        }
    })
}

$("#saveReport").click(saveReport);
$("#report-form").submit(saveReport);