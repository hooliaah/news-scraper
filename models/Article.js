// require mongoose
var mongoose = require('mongoose');

// use mongood schema constructor
var Schema = mongoose.Schema;

// define article schema
var NewArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    link: {
        type: String,
        required: true
    }, 
    // link to note model
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// create the new article schema using mongoose
var Article = mongoose.model("Article", NewArticleSchema);

// export model
module.exports = Article;