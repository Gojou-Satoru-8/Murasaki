require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const app = require("./app");
// console.log(process.env);

const { DB_URI, DB_PASSWORD, PORT } = process.env;
const DB = DB_URI.replace("<PASSWORD>", DB_PASSWORD);

mongoose.connect(DB).then((conn) => {
  console.log(conn.models);
  console.log("Connection to MongoDB successful");
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server's up listening at port #${PORT}`);
});
