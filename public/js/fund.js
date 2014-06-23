/* Functions */
saveFund = function (event) {

    event.preventDefault();

    var name = $("#name").val(),
        description = $("#description").val(),
        city = $("#city").val(),
        helpsFor = $("#helpsFor").val(),
        site = $("#site").val(),
        mail = $("#mail").val(),
        phones = $("#phones").val();

    if (name &&
        description &&
        site &&
        mail &&
        phones) {
        alert("sending..")
        $.ajax({
            type: 'POST',
            url: '/fund/new',
            data: {
                name: name,
                description: description,
                city: city,
                helpsFor: helpsFor,
                site: site,
                mail: mail,
                phones: phones
            },
            success: function (msg) {
                $('#newFundtModal').modal('hide');
                /*TODO: loader*/
                if (msg.status == "1") {
                    $('#fundPath').attr("href", "/fund/admin/" + msg.fundId);
                    $('#newFundSuccessModal').modal('show');
                } else {
                    alert("Error");
                }
            }
        })
    } else {
        alert("All fields must be filled...")
    }
};

/* Save fund */
$("#saveFund").click(saveFund);
$("#fund-form").submit(saveFund);

/* Clear fund form */
$('#newFundModal').on('hidden.bs.modal', function (e) {
    $('#fund-form')[0].reset();
})
