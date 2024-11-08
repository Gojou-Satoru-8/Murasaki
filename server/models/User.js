const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// MONGOOSE SCHEMA:
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username already taken"],
      minLength: [3, "Username must be at least 5 characters long"],
      validate: [validator.isAlphanumeric, "Please enter a valid username"],
    },
    name: {
      type: String,
      required: [true, "Name is a required field"],
      validate: {
        validator: function (val) {
          // Original simple regex: /^[A-Z][a-z]+ [A-z][a-z]+$/ [Accounts for firstName+lastName with alphabets only]
          // const regex =
          //   /^[A-Z][a-zA-Z]*(?:[-'][A-Z][a-zA-Z]*)?\s[A-Z][a-zA-Z]*(?:[-'][A-Z][a-zA-Z]*)?$/;
          // return regex.test(val);  // This accounts for names like John O'Connor, John Levy-Hamilton
          // OR:
          return (
            val.search(
              /^[A-Z][a-zA-Z]*(?:[-'][A-Z][a-zA-Z]*)?\s[A-Z][a-zA-Z]*(?:[-'][A-Z][a-zA-Z]*)?$/
            ) !== -1
          );
        },
        message: "Please enter a valid Name",
      },
    },
    email: {
      type: String,
      required: [true, "Email is a required field"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Password is a required field"],
      minLength: [8, "Password must have minimum 8 characters"],
      maxLength: [15, "Password must not exceed 15 characters"],
      validate: [
        validator.isStrongPassword,
        "Password must have atleast 1 uppercase, 1 lowercase, 1 numeric and 1 symbolic character",
      ],
    },
    dateCreated: { type: Date, required: true, default: Date.now },
    lastPasswordChanged: {
      type: Date,
      select: false,
      // default: Date.now()
    },
    settings: {
      uiTheme: { type: String, default: "light" },
      codeEditorTheme: { type: String, default: "Atomone" },
      codeEditorWindowSize: {
        type: Number,
        default: 500,
        min: [250, "Editor should be at least 250px"],
        max: [1000, "Editor cannot exceed 1000px"],
      },
      codeEditorFontSize: {
        type: Number,
        default: 15,
        min: [10, "Font-size should be at least 10px"],
        max: [20, "Font-size cannot exceed 20px"],
      },
    },
    passwordResetToken: { type: String, select: false },
    passwordResetTokenExpiry: { type: Date, select: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIrtual fields (notes):
userSchema.virtual("notes", {
  ref: "Note",
  localField: "_id",
  foreignField: "user",
});

// MONGOOSE METHODS:
userSchema.methods.isPasswordCorrect = async function (password) {
  console.log("Given password: ", password);
  // return await bcrypt.compare(password, this.password);
  // Being an aync function this will always wrap the result into a promise, so there is no point in awaiting the value
  // of bcrypt.compare() here, since using await when calling the mongoose method is inevitable.
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generatePasswordResetToken = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  // const token = faker.string.hexadecimal({ length: 32, casing: "upper", prefix: "" });
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetToken = hashedToken;
  this.passwordResetTokenExpiry =
    Date.now() + Number.parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY) * 1000;
  await this.save({ validateBeforeSave: false });
  // console.log("Student after generating a reset token: ", this);
  console.log("Info about Password Reset Token generated:\n", {
    token,
    hashedToken,
    expiry: this.passwordResetTokenExpiry.toLocaleString("en-GB", { timezone: "Asia/Kolkata" }),
  });

  return token;
};

userSchema.methods.discardPasswordResetToken = async function () {
  this.passwordResetToken = undefined;
  this.passwordResetTokenExpiry = undefined;
  await this.save({ validateBeforeSave: false });
};

// MONGOOSE MIDDLEWARES:
// userSchema.pre("save",  function (next) {
//   this.dateCreated = Date.now()
//   next();
// });
userSchema.pre("save", async function (next) {
  console.log("Mongoose Hook ran");

  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 8);
  this.lastPasswordChanged = Date.now();

  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
