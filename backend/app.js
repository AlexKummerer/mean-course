const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const app = express();
mongoose
  .connect(
    "mongodb+srv://dbAdmin:C4A8141040C2D5645AE7CD273915C221D63D123E89F9738B9AAE95D2265280F1@meancourse.n6pcukz.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With , Content-Type , Accept "
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH,PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
