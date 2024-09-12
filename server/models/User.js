const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

// MONGOOSE SCHEMA:
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username already taken"],
      minLength: [3, "Username must be at least 5 characters long"],
    },
    name: {
      type: String,
      required: [true, "Name is a required field"],
      validate: {
        validator: function (val) {
          return val.search(/^[a-zA-Z]+ [a-zA-Z]+$/) !== -1;
          // Regex for name consisting of firstName <Space> LastName
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
    },
    dateCreated: { type: Date, required: true, default: Date.now() },
    lastPasswordChanged: { type: Date, select: false, default: Date.now() },
    settings: String,
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

  return await bcrypt.compare(password, this.password);
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
