const express = require("express");
const Post = require("../models/post")

const router = express.Router();


router.post("", (req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  console.log(post);
  post.save().then((createdResult) => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdResult._id,
    });
  });
});
router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });

  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update succesfully" });
  });
});

router.get("", (req, res, next) => {
  Post.find().then((docs) => {
    res
      .status(200)
      .json({ message: " Posts fetsched succesfully ", posts: docs });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted" });
  });
});

module.exports = router
