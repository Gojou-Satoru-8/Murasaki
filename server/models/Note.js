const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Note author is a required field"],
  },
  title: {
    type: String,
    required: [true, "Title is a required field"],
  },
  summary: {
    type: String,
    // required: [true, "Please provide a summary"],
  },
  tags: [String],
  noteContent: {
    type: [Object],
    // required: true,
  },
  codeContent: {
    type: String,
    // required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  dateModified: Date,
  viewCount: {
    type: Number,
    default: 0,
  },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
