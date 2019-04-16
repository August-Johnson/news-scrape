$(function () {
    // Home page / unsaved articles
    $.get("/").then(function (data) {
        if (!data || data.length >= 0) {
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
    $("#saved-articles").on("click", function (event) {
        event.preventDefault();

        $.get("/saved").then(function (response) {
            console.log(response);
        });

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

});
