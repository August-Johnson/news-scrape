var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var app = express();

var PORT = 3000;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting up handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Requiring the apiRoutes
require("./routes/apiRoutes.js")(app);

// MongoDB setup
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});