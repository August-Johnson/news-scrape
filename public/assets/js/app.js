$(document).ready(function () {

    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus');
    });

    // Home page / unsaved articles
    $.get("/").then(function (data) {
        if (!data || data.length <= 0) {
            $("#articles-container").html(
                '<div class="jumbotron jumbotron-fluid text-center">'
                + '<div class="container">'
                + '<h1 class="display-4">NO ARTICLES</h1>'
                + '<p class="lead">Looks like you don\'t have any new articles!</p>'
                + '</div >'
                + '</div >'
            );
        }
        console.log("Articles");
    });

    // Loads the page with the user's saved articles
    $.get("/saved").then(function (data) {
        if (!data || data.length <= 0) {
            $("#articles-container").html(
                '<div class="jumbotron jumbotron-fluid text-center">'
                + '<div class="container">'
                + '<h1 class="display-4">NO SAVED ARTICLES</h1>'
                + '<p class="lead">Looks like you don\'t have any saved articles!</p>'
                + '</div >'
                + '</div >'
            );
        }
        console.log("Saved Articles");
    });

    // When the user pressed the scrape articles button, make a request to /scrape
    $("#scrape-articles").on("click", function (event) {
        event.preventDefault();
        $("#articles-container").empty();

        $.get("/scrape").then(function () {
            console.log("Scrape Completed");
            location.reload();
        });
    });

    // Saving an article and using it's data-id for the put request
    $(document).on("click", ".save-article", function (event) {
        event.preventDefault();

        var id = $(this).attr("data-article-id");
        console.log(id);

        $.ajax("/saveArticle/" + id, {
            type: "PUT"
        }).then(function (data) {
            console.log(data);
            location.reload();
        });
    });


    $(document).on("click", ".delete-article", function (event) {
        event.preventDefault();

        var id = $(this).arrt("data-article-id");
        console.log(id);

        $.ajax("/deleteArticle/" + id, {
            type: "PUT"
        }).then(function (data) {
            console.log(data);
            location.reload();
        });
    });


    $(document).on("click", ".add-article-note", function (event) {
        event.preventDefault();

        var id = $(this).attr("data-article-id");
        console.log(id);

        $("myModalTitle").html("Notes For Article: " + id);

        $.get("/notes/" + id).then(function (data) {
            console.log(data);
            if (!data || data.lenght <= 0) {
                
            }
        });
    });


    // $(document).on("click", ".add-article-note", function (event) {
    //     event.preventDefault();

    //     var id = $(this).attr("data-article-id");
    //     console.log(id);

    //     $.ajax("/addNote/" + id, {
    //         type: "POST",
    //         data: note
    //     }).then(function (data) {
    //         console.log(data);
    //     });
    // })
});
