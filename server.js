var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require("mongoose");

var app = express();

require("./routes/apiRoutes.js")(app);

var PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});