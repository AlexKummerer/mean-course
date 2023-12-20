const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      email: email,
      password: hash,
    });
    const result = await user.save();
    res.status(201).json({
      message: "User created successfully!",
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Invalid authentication credentials!",
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed. User not found.",
      });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(401).json({
        message: "Authentication failed. Invalid password.",
      });
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      "process.env.JWT_KEY",
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      message: "Authentication successful!",
      token: token,
      expiresIn: 3600,
      userId: user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Invalid authentication credentials!",
    });
  }
};
