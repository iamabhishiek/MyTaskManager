const express = require("express");
var PORT = process.env.PORT || 3000;

const { db } = require("./db");
const taskRoute = require("./routes/tasks");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", express.static(__dirname + "/public"));
app.use("/todos", taskRoute);

db.sync({ alter: true })
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.error(err);
  });
