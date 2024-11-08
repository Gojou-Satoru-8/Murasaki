const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

process.on("uncaughtException", (err) => {
  console.log("--------------⚠️ UNCAUGHT EXCEPTION ⚠️-------------- ");
  console.log(err);
  process.exit(1);
});

const mongoose = require("mongoose");
const app = require("./app");

// console.log(process.env);
const { DB_URI, DB_PASSWORD, PORT } = process.env;
const DB = DB_URI.replace("<PASSWORD>", DB_PASSWORD);

mongoose.connect(DB).then((conn) => {
  console.log("---------MONGODB CONNECTION SUCCESSFUL----------");
  // console.log(conn.modelNames());
  console.log(conn.models);
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server's up! Listening at port #${PORT}`);
});

// server.on("close", () => {
//   console.log("SERVER SHUT DOWN");
//   process.exit(1);
// });

process.on("unhandledRejection", (reason, promise) => {
  console.log("--------------⚠️ UNHANDLED REJECTION ⚠️ --------------");
  console.log("Reason: ", reason);
  // console.log("Rejected Promise: ", promise);
  // server.close();  // In case using server.on("close") to pass callback with shutdown message.
  server.close((err) => {
    if (err) console.log("Error in shutdown procedure: ", err);
    console.log("SERVER SHUT DOWN");
    process.exit(1);
  });
});
