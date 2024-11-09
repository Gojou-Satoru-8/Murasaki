const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");
// const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");  // Deprecated - need to search for alternative
// const hpp = require("hpp");

const User = require("./models/User");
const authRouter = require("./routes/authRouter");
const noteRouter = require("./routes/noteRouter");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
const { DB_URI, DB_PASSWORD, SESSION_STORE_SECRET, NODE_ENV } = process.env;
const DB = DB_URI.replace("<PASSWORD>", DB_PASSWORD);

// MIDDLEWARES:
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "short"));

// SECURITY MIDDLEWARES:
// 1) Set security HTTP Headers:
// app.use(helmet());

// 2) Limit number of requests in a given time window (in ms) from a certain IP
app.use(
  "/",
  rateLimit({
    max: process.env.NODE_ENV === "production" ? 300 : 1000,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour",
  })
);

// 3) Sanitizing POST request body against NoSQL query injection and XSS:
app.use(mongoSanitize());
// app.use(xss());

// 4) Prevent HTTP Parameter Pollution in URL query string (OPTIONAL):
// app.use(
//   hpp({
//     whitelist: ["name", "codeContent" ,"noteContent", "email", "language"],
//   })
// );

// APPLICATION MIDDLEWARES:
app.use(
  cors({
    origin: ["http://localhost:5173"],
    // methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/dist`));
app.use(
  session({
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

// ROUTE MIDDLEWARES:
app.get("/api/users", async (req, res, next) => {
  try {
    const allUsers = await User.find(req.query);
    res.json(allUsers);
  } catch (err) {
    console.log(err);
    res.json({ status: "fail", message: err.message });
  }
});

app.use("/api/", authRouter);
app.use("/api/notes", noteRouter);
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
