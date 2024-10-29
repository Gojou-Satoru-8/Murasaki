require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const app = require("./app");
// console.log(process.env);

process.on("uncaughtException", (err) => {
  console.log("------------UNCAUGHT EXCEPTION----------------");
  console.log(err);
  process.exit(1);
});

const { DB_URI, DB_PASSWORD, PORT } = process.env;
const DB = DB_URI.replace("<PASSWORD>", DB_PASSWORD);

mongoose.connect(DB).then((conn) => {
  console.log(conn.models);
  console.log("Connection to MongoDB successful");
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server's up listening at port #${PORT}`);
});

server.on("close", (code) => {
  console.log("SERVER CLOSED WITH EXIT CODE:", code);
});

process.on("unhandledRejection", (err) => {
  console.log("------------UNHANDLED REJECTION----------------");
  console.log(err);
  server.close((err) => {
    console.log("SERVER CLOSED WITH ERROR:", err);
    process.exit(1);
  });
});
