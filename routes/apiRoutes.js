var cheerio = require("cheerio");
var axios = require("axios");
var db = require("../models");
module.exports = function (app) {

    // GET REQUESTS

    // Main page to view unsaved articles and/or scrape more
    app.get("/", function (req, res) {
        // Finding all articles in the database that aren't previously saved by the user
        db.Article.find({ saved: false }).then(function (articlesData) {

            // If there are no articles or none that aren't saved, 
            // render the index page and pass an array with a length of 1 (the actual content doesn't matter)
            if (!articlesData || articlesData.length <= 0) {
                return res.render("index", { noArticles: [1] });
            }
            // Render the index.handlebars to the html with the returning data
            res.render("index", { article: articlesData });
        }).catch(function (err) {
            res.json(err);
        });
    });

    // Viewing all saved articles
    app.get("/saved", function (req, res) {
        // Finding all articles in the database that have been saved by the user
        db.Article.find({ saved: true }).then(function (savedArticlesData) {

            // If there are no saved articles, 
            // render the saved-articles page and pass an array with a length of 1 (the actual content doesn't matter)
            if (!savedArticlesData || savedArticlesData.length <= 0) {
                return res.render("saved-articles", { noSavedArticles: [1] });
            }
            // Render the saved-articles.handlebars to the html with the returning data
            res.render("saved-articles", { savedArticle: savedArticlesData });
        }).catch(function (err) {
            res.json(err)
        });
    });

    // Scraping New York Times for articles
    app.get("/scrape", function (req, res) {
        // Cheerio scraping the world news section
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

            // Targeting specific elements and classes (in this case, each world news article on the page)
            $("#stream-panel .css-13mho3u li").each(function (i, element) {

                // Results object that will be pushed into the Articles collection
                var results = {};

                // Grabbing the <h2> element's text for the title of the article
                results.title = $(element).find("h2").text();

                // Grabbing the <p> element's text for the article summary
                results.summary = $(element).find("p").text();

                // Grabbing the <a> tag's href attribute for the link to the article
                results.link = "https://www.nytimes.com" + $(element).find("a").attr("href");

                // Creating a new article document using the data above
                db.Article.create(results).then(function (data) {
                    console.log("Article added to collection!");
                }).catch(function (err) {
                    console.log(err);
                });
            });
            res.send("Scrape Complete!");
        });
    });

    // All Article data as JSON
    app.get("/articles", function (req, res) {

        // Getting all articles regardless of if they are saved or not
        db.Article.find().then(function (articlesData) {
            res.json(articlesData);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // Get single article data, based on its _id value - as JSON
    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id }).then(function (articleData) {
            res.json(articleData);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // View all notes for a saved article
    app.get("/articleNotes/:id", function (req, res) {
        // Finding the article by _id based on which saved article you are viewing
        db.Article.findOne({ _id: req.params.id }).populate("note").then(function (notesData) {
            res.json(notesData);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // POST REQUESTS

    // Add a new note to a saved article
    app.post("/addNote/:id", function (req, res) {
        // Creating a new note document using the form data from the front end
        db.Note.create(req.body).then(function (noteData) {
            // Returning an the article you're adding the note to, and pushing the newly created note into its note array
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: noteData._id } }, { new: true });
        }).then(function (updatedArticle) {
            res.json(updatedArticle);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // PUT REQUESTS

    // Save an article to your saved articles page
    app.put("/saveArticle/:id", function (req, res) {
        // Update the document to set its saved boolean value to true
        db.Article.updateOne({ _id: req.params.id }, { $set: { saved: true } }).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // Delete an article from your saved articles page
    app.put("/deleteArticle/:id", function (req, res) {
        // Updating the document to set its saved boolean value to false
        db.Article.updateOne({ _id: req.params.id }, { $set: { saved: false } }).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // DELETE REQUESTS

    // Delete a note from a saved article
    app.delete("/deleteNote/:id", function (req, res) {
        // Finding a note based on its _id and deleting it from the collection
        db.Note.findOneAndDelete({ _id: req.params.id }).then(function (response) {
            res.json(response);
        }).catch(function (err) {
            res.json(err);
        });
    });
};