const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// PATH: /signup
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

// PATH: /login
exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (!userDoc) throw new AppError(404, "No such user with the entered email");

  const isPasswordMatch = await userDoc.isPasswordCorrect(password);
  if (!isPasswordMatch) throw new AppError(401, "Incorrect Password");

  // If credentials are correct:
  req.session.user = userDoc;

  res.status(200).json({ status: "success", message: "Authenticated successfully", user: userDoc });
});

// PATH: /logout
exports.logout = catchAsync((req, res, next) => {
  req.session.destroy((err) => {
    if (err) throw new AppError(500, "Unable to log out");
  });
  res.clearCookie("connect.sid");
});
