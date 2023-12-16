const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Create a new user
router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      email: email,
      password: hash,
    });

    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

module.exports = router;
