
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Create a new user
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });

  newUser.save()
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
