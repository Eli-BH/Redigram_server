const express = require("express");
const router = express.Router();

const {
  authRegister,
  loginRegister,
} = require("../controllers/authControllers");

router.post("/register", authRegister);

router.post("/login", loginRegister);

module.exports = router;
