const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (matchPass) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(matchPass, user.password, (err, isMatch) => {
      if (err) return reject(err);

      if (!isMatch) return reject(false);

      resolve(true);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
