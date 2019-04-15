$(function () {
    $.get("/articles").then(function (articlesData) {
        console.log(articlesData.length);
        console.log(articlesData);

        // create articles html elements
        for (var i = 0; i < articlesData.length; i++) {
            var article = articlesData[i];

            var newArticle = $(
                '<div class="card">'
                + '<div class="card-header bg-primary text-white">'
                + '<div class="row">'
                + '<div class="col-9">'
                + '<h5>' + article.title + '</h5>'
                + '</div>'
                + '<div class="col-3">'
                + '<button class="btn btn-success">Save Article</button>'
                + '<a href="' + article.link + '" <button class="btn btn-secondary">View Article</button></a>'
                + '</div>'
                + '</div>'
                + '</div>'

                + '<div class="row">'
                + '<div class="col-12">'
                + '<div class="card-body">'
                + '<p class="card-text">' + article.summary + '</p>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'
            );

            $("#articles-container").append(newArticle);
        }

    });


    $("#scrape-articles").on("click", function (event) {
        event.preventDefault();
        $("#articles-container").empty();

        $.get("/scrape").then(function (scrapeData) {
            console.log(scrapeData);
            console.log("Scrape Completed");
            location.reload();
        });
    });


});


