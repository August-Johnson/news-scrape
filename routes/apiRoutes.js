var cheerio = require("cheerio");
var axios = require("axios");
var db = require("../models");
module.exports = function (app) {

    // Main page to view unsaved articles and scrape more
    app.get("/", function (req, res) {

        db.Article.find({ saved: false }).then(function (articlesData) {
            res.render("index", { article: articlesData });
        }).catch(function (err) {
            res.json(err);
        });
    });

    // Viewing all saved articles
    app.get("/saved", function (req, res) {
        db.Article.find({ saved: true }).then(function (savedArticlesData) {
            res.render("saved-articles", { savedArticle: savedArticlesData });
        }).catch(function (err) {
            res.json(err)
        });
    });

    // Scraping New York Times for articles
    app.get("/scrape", function (req, res) {
        axios.get("https://www.nytimes.com/section/world").then(function (response) {

            var $ = cheerio.load(response.data);

            // Clearing out all documents in the articles collection that haven't been saved by the user
            db.Article.deleteMany({ saved: false }, function (err, cb) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(cb);
                }
            });

            $("#stream-panel .css-13mho3u li").each(function (i, element) {

                var results = {};

                // Grabbing the <h2> element's text for the title of the article
                results.title = $(element).find("h2").text();

                // Grabbing the <p> element's text for the article summary
                results.summary = $(element).find("p").text();

                // Grabbing the <a> tag's href attribute for the link to the article
                results.link = "https://www.nytimes.com" + $(element).find("a").attr("href");

                // Creating a new article document using the data above
                db.Article.create(results).then(function (data) {
                    console.log(data);
                }).catch(function (err) {
                    console.log(err);
                });
            });
            res.send("Scrape Complete!");
        });
    });

    // All Articles json data
    app.get("/articles", function (req, res) {
        db.Article.find().then(function (articlesData) {
            res.json(articlesData);
        }).catch(function (err) {
            res.json(err);
        });
    });


    // Save an article
    app.put("/saveArticle/:id", function (req, res) {
        db.Article.update({ _id: req.params.id }, { $set: { saved: true } }).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.json(err);
        });
    });

};