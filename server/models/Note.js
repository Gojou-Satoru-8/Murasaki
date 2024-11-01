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
  language: {
    type: String,
    enum: {
      values: ["Python3", "Java", "C++", "C"],
      default: "Python3",
      required: [true, "Please select an language (Python3, Java, C++, C)"],
    },
  },
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
