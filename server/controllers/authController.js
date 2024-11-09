const crypto = require("crypto");
const UAParser = require("ua-parser-js");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const sendMail = require("../utils/sendMail");
const refreshSessionUser = require("../utils/refreshSessionUser");
// ROUTE: /signup [POST]
exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // const { email, username, name, password, confirmPassword } = req.body;
  const createdUser = await User.create({ ...req.body });

  res.status(200).json({
    status: "success",
    message: "Sign Up successful. Please move to log in page",
    user: createdUser,
  });
});

// ROUTE: /login [POST]
exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email }).select("+password");

  if (!userDoc) throw new AppError(404, "No such user with the entered email");

  const isPasswordMatch = await userDoc.isPasswordCorrect(password);
  if (!isPasswordMatch) throw new AppError(401, "Incorrect Password");

  // If credentials are correct:

  req.session.user = userDoc;

  const parser = new UAParser(req.headers["user-agent"]);
  const deviceInfo = parser.getResult();

  req.session.device = {
    device: deviceInfo.device.type || "unknown", // 'desktop' as fallback
    browser: deviceInfo.browser.name,
    os: deviceInfo.os.name,
  };

  // req.session.device = req.headers.or

  await req.session.save();
  console.log("Session after saving user and device: ", req.session);

  res.status(200).json({ status: "success", message: "Logged in successfully", user: userDoc });
});

// ROUTE: /logout [GET]
exports.logout = catchAsync(async (req, res, next) => {
  // req.session.destroy((err) => {
  //   if (err) throw new AppError(500, "Unable to log out");
  // });

  await req.session.destroy();
  res.clearCookie("murasaki_cookie");
  console.log("Logged out successfully.. Cookie cleared if following shows undefined:");
  console.log(req.session);

  res.status(200).json({
    status: "success",
    message: "Logged Out successfully",
  });
});

// Middleware to control access to protected routes:
exports.checkAuth = (req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  if (req.session && req.session.user) return next();
  // return res.status(401).json({
  //   status: "fail",
  //   message: "User is not logged in",
  // });
  throw new AppError(401, "User is not authenticated");
};

// ROUTE: /user [GET] - To be used exclusively by client-side
exports.getCurrentUser = (req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  res.status(200).json({
    status: "success",
    user: req.session.user, // Either a valid user object or undefined (if not authenticated)
  });
};

// ROUTE: /user [PATCH]
exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  console.log(req.url, req.method, req.body);
  const { username, name } = req.body; // Only accenting username and name
  const updatedUser = await User.findByIdAndUpdate(
    req.session.user._id,
    { username, name },
    { new: true, runValidators: true }
  );

  console.log(updatedUser);
  if (!updatedUser) throw new AppError(404, "No such user found!");

  // req.session.user = updatedUser;
  // await req.session.save();
  await refreshSessionUser(updatedUser, req.session);
  return res.status(200).json({
    status: "success",
    message: "User information updated successfully",
    user: updatedUser,
  });
});

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.session.user._id);
  next();
  // res.status(204).json({
  //   status: "success",
  //   message: "Deleted Successfully",
  // });
});

// ROUTE: /generate-token [POST] - For use in both forgot-password and update-password
exports.mailPasswordResetToken = catchAsync(async (req, res, next) => {
  // This middleware will generate a reset-password-token, sent by mail, to be entered by Users.
  // (1) Get user via email:
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new AppError(404, `No user associated with this email`);

  // (2) Generate Password Reset Token (a hashed version will be in user's document in DB):
  const token = await user.generatePasswordResetToken();
  console.log(`Password Reset Token: ${token}`);

  // (3) Set mail message and send mail:

  const message = `Enter this token to reset your password:\n${token}`;
  try {
    await sendMail({
      recipient: ["ankushbhowmikf12@gmail.com", "itsmeankush893@outlook.com", req.body.email],
      subject: "Reset Password Link (Valid for 10 minutes)",
      mailBody: message,
    });
    console.log("Mail sent successfully");
    res.status(200).json({
      status: "success",
      message: `Password Reset Token sent to your email at ${new Date().toLocaleString("en-UK", {
        timeZone: "Asia/Kolkata",
      })}`,
    });
  } catch (err) {
    // If there was error sending mail, then discard the token.
    await user.discardPasswordResetToken();
    throw new AppError(err.message, 500, "JSON");
  }
});

exports.discardToken = catchAsync(async (req, res, next) => {});

// ROUTE: /reset-password [POST]: To be used when user is resetting forgotten password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Requires new password and token from request body:
  console.log(req.body);
  const { token, password } = req.body;
  // (1) Hash the token from request body
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // (2) Find user via the hashed token.
  const user = await User.findOne({ passwordResetToken: hashedToken }).select(
    // "+password +passwordResetToken +passwordResetTokenExpiry"  // passwordResetToken not explicitly required
    "+password +passwordResetTokenExpiry"
  );
  if (!user) throw new AppError(400, "Invalid Token!");
  console.log("User found: ", user);
  console.log(
    "Password Reset Token Expiry in IST: ",
    user.passwordResetTokenExpiry.toLocaleString("en-GB", { timezone: "Asia/Kolkata" })
  );

  // (3) Check if token has expired (it's expiry time in unix timestamp must be less than now):
  if (user.passwordResetTokenExpiry < Date.now())
    throw new AppError(400, "Token for updating password has expired");

  // (4) Check is password matches the existing one:
  const isPasswordMatch = await user.isPasswordCorrect(password);
  if (isPasswordMatch) throw new AppError(400, "New Password can't be the same as old password");

  // (5) Proceed towards updating the password.
  user.password = password;
  // user.passwordConfirm = passwordConfirm;
  await user.save({ validateBeforeSave: true });
  await user.discardPasswordResetToken();

  // (6) Send confirmation:
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});

// ROUTE: /update-password [POST] To be used when user is updating current password (has to be logged in)
exports.updatePassword = catchAsync(async (req, res, next) => {
  // Requires new password and token from request body:
  console.log(req.body);
  const { token, currentPassword, newPassword } = req.body;

  // (1) Hash the token from request body
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // (2) Find user via the hashed token.
  const user = await User.findOne({ passwordResetToken: hashedToken }).select(
    // "+password +passwordResetToken +passwordResetTokenExpiry"  // passwordResetToken not explicitly required
    "+password +passwordResetTokenExpiry"
  );
  if (!user) throw new AppError(400, "Invalid Token!");
  console.log("User found: ", user);
  console.log(
    "Password Reset Token Expiry in IST: ",
    user.passwordResetTokenExpiry.toLocaleString("en-GB", { timezone: "Asia/Kolkata" })
  );

  // (3) Check if token has expired (it's expiry time in unix timestamp must be less than now):
  if (user.passwordResetTokenExpiry < Date.now())
    throw new AppError(400, "Token for updating password has expired");

  // (4) Check is currentPassword is same:
  const isPasswordMatch = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordMatch) throw new AppError(400, "Current Password is incorrect");

  // (5) New password shouldn't be the same as old password:
  if (newPassword === currentPassword)
    throw new AppError(400, "New Password cannot be the same as old password");
  // Client-side has same validation, so it is likely not to be triggered.

  // (6) Proceed towards updating the password.
  user.password = newPassword;
  // user.passwordConfirm = passwordConfirm;
  await user.save({ validateBeforeSave: true });
  await user.discardPasswordResetToken();

  await refreshSessionUser(user, req.session);
  // (6) Send confirmation:
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

exports.updateUserSettings = catchAsync(async (req, res, next) => {
  console.log("triggered");

  console.log(req.url, req.method, req.body);

  const updatedUser = await User.findByIdAndUpdate(
    req.session.user._id,
    { settings: { ...req.body } },
    { new: true, runValidators: true }
  );
  if (!updatedUser) throw new AppError(404, "No user found!");
  console.log(updatedUser);
  // const user = await User.findById(req.session.user._id);
  // user.settings = req.body;
  // await user.save({ validateBeforeSave: false });
  await refreshSessionUser(updatedUser, req.session);
  res
    .status(200)
    .json({ status: "success", message: "Settings updated successfully", user: updatedUser });
});

exports.getTinyMCEKey = (req, res, next) => {
  const { TINYMCE_API_KEY } = process.env;
  if (!TINYMCE_API_KEY) throw new AppError(404, "Missing API Key for TinyMCE");
  res
    .status(200)
    .json({ status: "success", message: "API Key retrieved and sent", apiKey: TINYMCE_API_KEY });
};
