const express = require("express");
const noteController = require("../controllers/noteController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.checkAuth);
router.route("/").get(noteController.getAllNotes).post(noteController.postNote);
router
  .route("/:id")
  .get(noteController.getNote)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

module.exports = router;
