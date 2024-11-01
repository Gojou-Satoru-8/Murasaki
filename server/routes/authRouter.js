const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/generate-token").post(authController.mailPasswordResetToken);
router.route("/reset-password").post(authController.resetPassword);

// NOTE: All routes below need authentication:
router.use(authController.checkAuth);
router.route("/logout").get(authController.logout);
router
  .route("/user")
  .get(authController.getCurrentUser)
  .patch(authController.updateCurrentUser)
  .delete(authController.deleteCurrentUser, authController.logout);
router.route("/update-password").post(authController.updatePassword);
router.route("/user/settings").patch(authController.updateUserSettings);
module.exports = router;
