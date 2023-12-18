const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");

// Create a new user
router.post("/signup", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      email: email,
      password: hash,
    });
    console.log(user);

    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created successfully!",
          result: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed. User not found.",
        });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authentication failed. Invalid password.",
          });
        }
        if (result) {
          const token = jwt.sign(
            { email: user.email, userId: user._id },
            "secret_this_should_be_longer",
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            message: "Authentication successful!",
            token: token,
            expiresIn: 3600,
            userId: user._id,
          });
        }
        return res.status(401).json({
          message: "Authentication failed. Invalid password.",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
