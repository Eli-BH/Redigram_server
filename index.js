require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const port = 4000;
const app = express();

//middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Server working");
});

app.listen(port, () => {
  console.log("listening on port 3000");
  mongoose
    .connect("mongodb://localhost:27017/appname", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((err) => console.log(err));
});
