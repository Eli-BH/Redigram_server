require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const snoowrap = require("snoowrap");
const UserAgent = require("user-agents");

const userAgent = new UserAgent();

const r = new snoowrap({
  userAgent: userAgent.toString(),
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN,
  accessToken: process.env.REDDIT_ACCESS_TOKEN,
});

const port = 4000;
const app = express();

//middleware
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json("Server working");
});
app.get("/posts", (req, res) => {
  const postArr = [];
  r.getHot()
    .map((posts) => posts?.media?.reddit_video || posts?.preview?.images)
    .then((all) => {
      const posts = [];
      for (let i of all) {
        if (i) posts.push(i);
      }

      res.send(posts);
    });
});

app.get("/new", async (req, res) => {
  const newPosts = await r.getNew().map((post) => post.title);

  res.json({ date: Date.now(), newPosts });
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
