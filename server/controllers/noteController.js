const Note = require("../models/Note");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// ROUTE: /notes [GET]
exports.getAllNotes = catchAsync(async (req, res, next) => {
  const allNotes = await Note.find({ user: req.session.user.id });
  if (allNotes.length === 0) throw new AppError(404, "User has no notes");
  res.status(200).json({
    status: "success",
    message: "Notes belonging to the logged in user has been retrieved",
    notes: allNotes,
  });
});

// ROUTE: /notes [POST]
exports.postNote = catchAsync(async (req, res, next) => {
  console.log("Request body: ", req.body);
  console.log("Current user: ", req.session.user);

  const newNote = await Note.create({
    ...req.body,
    user: req.session.user.id,
  });
  if (!newNote) throw new AppError(500, "Unable to save note");

  res.status(201).json({
    status: "success",
    message: `Note created with id ${newNote.id}`,
  });
});

// ROUTE: /notes/:id [GET]
exports.getNote = catchAsync(async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  if (!note) throw new AppError(404, "No such note with the specific ID");
  res.status(200).json({
    status: "success",
    message: "Note with specific Id has been retrieved",
    note,
  });
});

// ROUTE: /notes/:id [PATCH]
exports.updateNote = catchAsync(async (req, res, next) => {
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
  if (!updatedNote) throw new AppError(404, "No such note with the specific ID");
  res.status(200).json({
    status: "success",
    message: "Note updated",
    note: updatedNote,
  });
});

// ROUTE: /notes/:id [DELETE]
exports.deleteNote = catchAsync(async (req, res, next) => {
  const deletedNote = await Note.findByIdAndDelete(req.params.id);
  console.log(deletedNote);

  res.status(204).json({
    status: "success",
    message: "Deleted successfully",
  });
});
