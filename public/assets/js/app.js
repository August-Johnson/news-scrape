$(document).ready(function () {
    // Declaring an id variable from the start
    var id;
    // console.log("Starting id value: " + id);

    // Function for getting and printing all notes for a certain article. 
    // Takes an argument that will represent the article's id
    function getArticleNotes(articleId) {
        $.get("/articleNotes/" + articleId).then(function (data) {
            // Empty the article notes div in the modal
            $(".article-notes").empty();

            // If there are no notes for the article, display generic message
            if (!data.note || data.note.length <= 0) {
                $(".article-notes").html("<h5>No notes for this article yet.</h5>");
            }
            else {
                // Creating an array with the same value of the data.notes array. (easier for me to manage and reference)
                var noteArray = data.note;
                // console.log(noteArray);
                // console.log(noteArray.length);
                for (var i = 0; i < noteArray.length; i++) {

                    // Setting a variable equal to the current note object in the loop. (easier for me to manage and reference)
                    var note = noteArray[i];

                    // Creating a Bootstrap card for each note
                    $(".article-notes").append(
                        '<div class="card">'
                        + '<div class="card-body">'
                        + '<div class="row">'
                        + '<div class="col-10">'
                        + note.body
                        + '</div>'
                        + '<div class="col-2">'
                        + '<button class="btn btn-warning delete-saved-note" data-note-id="' + note._id + '">X</button>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                    );
                }
            }
        });
    }

    // Modal JavaScript logic from Bootstrap
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus');
    });

    // Home page / unsaved articles
    $.get("/").then(function (data) {
        // console.log(data);
    });

    // Loads the page with the user's saved articles
    $.get("/saved").then(function (data) {
        // console.log(data);
    });

    // STANDARD ELEMENT CLICK EVENTS

    // When the user pressed the scrape articles button, make a request to /scrape
    $("#scrape-articles").on("click", function (event) {
        event.preventDefault();
        // Empty all content from the articles-container div
        $("#articles-container").empty();

        $.get("/scrape").then(function () {
            console.log("Scrape Completed");
            // Reload the page to show the updated articles
            location.reload();
        });
    });

    // Add a new note to a saved article
    $("#save-new-note").on("click", function (event) {
        event.preventDefault();

        // Create an note object to send in the POST request
        var note = {
            body: $("#note-input-text").val().trim()
        }

        $.ajax("/addNote/" + id, {
            type: "POST",
            data: note
        }).then(function (data) {
            // console.log(data);
            // Emptying the input field
            $("#note-input-text").val("");
            // Calling the function to update the note list for the article
            getArticleNotes(id);
        });
    });

    // DYNAMICALLY CREATED ELEMENT CLICK EVENTS

    // Saving an article and using its data-article-id for the PUT request
    $(document).on("click", ".save-article", function (event) {
        event.preventDefault();

        // Setting id equal to the id of the article being saved. id is coming from the element's data attribute
        id = $(this).attr("data-article-id");
        // console.log(id);

        $.ajax("/saveArticle/" + id, {
            type: "PUT"
        }).then(function (data) {
            // console.log(data);
            // Reload the page show the updated saved articles
            location.reload();
        });
    });

    // Delete an article from your saved articles
    $(document).on("click", ".delete-article", function (event) {
        event.preventDefault();

        id = $(this).attr("data-article-id");
        // console.log(id);

        $.ajax("/deleteArticle/" + id, {
            type: "PUT"
        }).then(function (data) {
            // console.log(data);
            // Reload the page to show the updated saved article list
            location.reload();
        });
    });

    // view all notes for a saved article
    $(document).on("click", ".add-article-note", function (event) {
        event.preventDefault();

        id = $(this).attr("data-article-id");
        console.log(id);

        $(".note-article-id").text(id);

        // Calling a function that does a GET request to fetch all notes for the saved article
        getArticleNotes(id);
    });

    // Delete a note from a saved article
    $(document).on("click", ".delete-saved-note", function (event) {
        event.preventDefault();

        // Setting a variable equal to the note you are trying to delete's _id.
        var noteId = $(this).attr("data-note-id");
        $.ajax("/deleteNote/" + noteId, {
            type: "DELETE"
        }).then(function (response) {
            // console.log(response);
            // Calling the function to update the note list
            getArticleNotes(id);
        });
    });

}); // End of document.ready()