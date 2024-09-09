const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  noteContent: {
    type: String,
    required: true,
  },
  codeContent: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  dateModified: Date,
  viewCount: {
    type: Number,
    default: 0,
  },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
