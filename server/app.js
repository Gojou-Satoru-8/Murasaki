const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./models/User");
const authRouter = require("./routes/authRouter");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
const { DB_URI, DB_PASSWORD, SESSION_STORE_SECRET, NODE_ENV } = process.env;

const DB = DB_URI.replace("<PASSWORD>", DB_PASSWORD);

app.use(
  session({
    store: MongoStore.create({ mongoUrl: DB, collectionName: "sessions" }),
    secret: SESSION_STORE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      // secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours in ms
    },
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res, next) => {
  res.send("Home Page");
});

app.get("/users", async (req, res, next) => {
  try {
    const allUsers = await User.find(req.query);
    res.json(allUsers);
  } catch (err) {
    console.log(err);
    res.json({ status: "fail", message: err.message });
  }
});

// app.post("/users", async (req, res, next) => {
//   try {
//     const user = await User.create({
//       ...req.body,
//     });

//     res.json(user);
//   } catch (err) {
//     console.log(err);
//     res.json({ status: "fail", message: err.message });
//   }
// });

app.use("/", authRouter);

// Global Error Handler:
app.use(globalErrorHandler);

module.exports = app;
