const uaParser = require("ua-parser-js");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

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
  const userDoc = await User.findOne({ email });

  if (!userDoc) throw new AppError(404, "No such user with the entered email");

  const isPasswordMatch = await userDoc.isPasswordCorrect(password);
  if (!isPasswordMatch) throw new AppError(401, "Incorrect Password");

  // If credentials are correct:

  req.session.user = userDoc;

  const parser = new uaParser(req.headers["user-agent"]);
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
  console.log("Logged out successfully.. Cookie cleared if following shows undefined");
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
  else throw new AppError(401, "User is not authenticated");
};

// ROUTE: /current-user [GET] - To be used exclusively by client-side
exports.getCurrentUser = (req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  res.status(200).json({
    status: "success",
    user: req.session.user, // Either a valid user object or undefined (if not authenticated)
  });
};
