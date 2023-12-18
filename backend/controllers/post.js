const { async } = require("rxjs");
const Post = require("../models/post");

const createImageUrl = (req) =>
  `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

const createPostObject = (req, imagePath) =>
  new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
    _id: req.body.id,
  });

exports.createPost = async (req, res, next) => {
  try {
    const post = createPostObject(req, createImageUrl(req));
    const createdPost = await post.save();
    res.status(201).json({
      message: "Post added successfully",
      post: {
        id: createdPost._id,
        ...createdPost,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Couldn't add post!",
    });
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    let imagePath = req.body.imagePath;
    if (req.file) {
      imagePath = createImageUrl(req);
    }
    const post = createPostObject(req, imagePath);

    const result = await Post.updateOne(
      { _id: req.body.id, creator: req.userData.userId },
      post
    );
    console.log(result);
    if (result.matchedCount > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't update post!",
    });
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    if (pageSize && currentPage) {
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    const fetchedPosts = await postQuery;
    const count = await Post.count();
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't fetch posts!",
    });
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't fetch post!",
    });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const result = await Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId,
    });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Post deleted" });
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't delete post!",
    });
  }
};
