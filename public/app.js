// display info for all articles
$.getJSON("/articles", function (data) {
    for (let i = 0; i < data.length; i++) {
        // add the title and link to a new div, so can style the title and link separately...
        $("#articles").append("<p data-id='" + data[i]._id + "'><strong>" + data[i].title + "</strong><br />" + data[i].link + "</p>");
    }
});


// when p tag is clicked, empty then show notes section
$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        //add notes section
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' value='note title'>");
            $("#notes").append("<textarea id='bodyinput' name='body' >note text</textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            $("#notes").append("<button data-id='" + data._id + "' id='delete-note'>Delete Note</button>");

            // if note already exists, display that info
            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

// save note
$(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
        });
});

// delete note
$(document).on("click", "#delete-note", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

// add PUT route to update notes