var cheerio = require("cheerio");
var axios = require("axios");
var db = require("../models");
module.exports = function (app) {

    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/saved", function (req, res) {
        res.render("saved-articles");
    });


    app.get("/scrape", function (req, res) {
        axios.get("https://www.nytimes.com/section/world").then(function (response) {

            var $ = cheerio.load(response.data);
            
            $("#stream-panel .css-13mho3u li").each(function (i, element) {

                var results = {};

                results.title = $(element).find("h2").text();
                results.summary = $(element).find("p").text();
                results.link = "https://www.nytimes.com" + $(element).find("a").attr("href");
                

            });
            // res.json(results);
            res.send("Scrape Complete!");
        });
    });

};