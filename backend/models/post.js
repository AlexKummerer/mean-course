const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, requered: true },
});

module.exports = mongoose.model("Post", postSchema);
