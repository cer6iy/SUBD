/* Functions */
saveEvent = function (event) {

    event.preventDefault();

    var title = $("#title").val(),
        description = $("#description").val(),
        eventType = $("#type").val(),
        startDate = $("#dateStart").val(),
        endDate = $("#dateEnd").val(),
        pub = $("#publish").prop("checked");

    if (title &&
        description &&
        eventType &&
        startDate &&
        endDate) {
        $.ajax({
            type: 'POST',
            url: '/event/new',
            data: {
                title: title,
                description: description,
                eventType: eventType,
                dateBegin: startDate,
                dateEnd: endDate,
                published: pub
            },
            success: function (msg) {
                $('#newEventModal').modal('hide');
                if (msg.status == "1") {
                    $('#eventPath').attr("href", "/event/" + msg.eventId);
                    $('#newEvenSuccesstModal').modal('show');
                } else {
                    alert("Error");
                }
            }
        })
    } else {
        alert("All fields must be filled...")
    }
};

/* Save event */
$("#saveEvent").click(saveEvent);
$("#event-form").submit(saveEvent);

/* Clear event form */
$('#newEventModal').on('hidden.bs.modal', function (e) {
    $('#event-form')[0].reset();
})

$('#vk').click(function(event){
    event.preventDefault();
    alert("Done");
})
