const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");

const User = require("./models/User");
const authRouter = require("./routes/authRouter");
const noteRouter = require("./routes/noteRouter");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
const { DB_URI, DB_PASSWORD, SESSION_STORE_SECRET, NODE_ENV } = process.env;

const DB = DB_URI.replace("<PASSWORD>", DB_PASSWORD);

app.use(morgan(process.env.NODE_ENV));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    // methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(`${__dirname}/dist`));
app.use(
  session({
    name: "murasaki_app",
    store: MongoStore.create({ mongoUrl: DB, collectionName: "sessions" }),
    secret: SESSION_STORE_SECRET,
    saveUninitialized: false,
    resave: false,
    name: "murasaki_cookie",
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours in ms
    },
  })
);

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
app.use("/notes", noteRouter);
app.all("*", (req, res, next) => {
  // console.log("Session ID:", req.sessionID);
  // console.log("Session:", req.session);
  // console.log("Session user: ", req.session.user);
  // console.log(req.cookies);

  // res.status(200).send({
  //   status: "success",
  //   message: "correctly logged session details",
  // });
  res.sendFile(`${__dirname}/dist/index.html`);
});
// Global Error Handler:
app.use(globalErrorHandler);

module.exports = app;
