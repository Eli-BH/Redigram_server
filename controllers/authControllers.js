const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
    //look for existing user in the database
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(200).json({ message: "This user already exists" });

    //if no existing user, create one

    const newUser = new User({ email, password });

    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      "superdupersecret"
    );

    res.status(201).json({ message: "New user created", token });
  } catch (error) {
    res.status(422).json({ error: error.message });
    console.log(error.message);
  }
};

const loginRegister = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send(400).json({ message: "Must provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    await user.comparePassword(password);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN);

    res.status(200).json({ message: "user authenticated", token });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Invalid credentials", error: error.message });
  }
};

module.exports = {
  authRegister,
  loginRegister,
};
