const AppError = require("../utils/AppError");

const handleCastErrorDB = (err) => {
  console.error("Triggered casterror");
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateFieldsDB = (err) => {
  console.error("Triggered duplicate fields error");
  // Typically triggered for when using existing email during signup/registration.
  // So making a special case for email in 1st message, else 2nd message takes care of other fields.
  let message;
  if (err.keyValue?.email) message = "User with the provided email already exists. Please log in!";
  else
    message = `Duplicate value for field ${Object.keys(err.keyValue).at(
      0
    )}. Please use another value`;
  return new AppError(400, message);
};

const handleValidationErrorDB = (err) => {
  //   const messages = [];
  //   for (const [name, obj] of Object.entries(err.errors)) {
  //     console.log(name);
  //     messages.push(`${name}: ${obj.message}`);
  //   }
  //   const errors = Object.entries(err.errors).map((el) => `${el[0]}: ${el[1]}`);
  // Here, every element el is an array of [key, value] pair within err.errors

  const fields = Object.keys(err.errors);
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input in fields: ${fields.join(", ")}. ${errors.join(". ")}`;
  return new AppError(400, message);
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "CastError") err = handleCastErrorDB(err);
  else if (err.code === 11000) err = handleDuplicateFieldsDB(err);
  else if (err.name === "ValidationError") err = handleValidationErrorDB(err);
  // Setting Default Values:
  err.statusCode ||= 500;
  err.status ||= "error";

  console.log("--------⚠️️ ERROR CONTROLLER ⚠️--------");
  console.log(err);
  res.status(err.statusCode).json({ status: err.status, message: err.message, error: err });
};

module.exports = globalErrorHandler;
