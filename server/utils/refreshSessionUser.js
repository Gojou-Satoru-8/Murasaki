const AppError = require("./AppError");

const refreshSessionUser = async (user, session) => {
  // userId is req.session.user._id and session is req.session
  // if (!userId || !session) {
  //   throw new Error("userId and session are required for refreshing session");
  // }

  // const freshUser = await User.findById(userId);
  // if (!freshUser) {
  //   throw new AppError(404, "User not found");
  // }

  // Update session with fresh user data
  session.user = user;

  // Return a promise that resolves when session is saved
  // return new Promise((resolve, reject) => {
  //   session.save((err) => {
  //     if (err) reject(err);
  //     resolve(freshUser);
  //   });
  // });
  await session.save();
};

module.exports = refreshSessionUser;
