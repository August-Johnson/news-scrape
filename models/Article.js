var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    summary: {
        type: String,
        require: false
    },
    link: {
        type: String,
        require: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;