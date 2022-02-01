require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const port = 4000;
const app = express();

//middleware
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json("Server working");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
  mongoose
    .connect("mongodb://localhost:27017/redigram", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((err) => console.log(err));
});
