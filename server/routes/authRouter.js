const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.use(authController.checkAuth);
router.route("/logout").get(authController.logout);
router
  .route("/user")
  .get(authController.getCurrentUser)
  .patch(authController.updateCurrentUser)
  .delete(authController.deleteCurrentUser, authController.logout);
module.exports = router;
