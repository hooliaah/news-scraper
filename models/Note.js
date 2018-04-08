// require mongoose
var mongoose = require('mongoose');

// use mongood schema constructor
var Schema = mongoose.Schema;

// define article schema
var NewNoteSchema = new Schema({
    title: {
        type: String,
    }, 
    body: {
        type: String,
    }
});

// create the new article schema using mongoose
var Note = mongoose.model("Note", NewNoteSchema);

// export model
module.exports = Note;