const Post = require("../models/post");

const createImageUrl = (req) => req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;

const createPostObject = (req, imagePath) => new Post({
  title: req.body.title,
  content: req.body.content,
  imagePath: imagePath,
  creator: req.userData.userId,
});


exports.createPost = (req, res, next) => {
  const post = createPostObject(req, createImageUrl(req));

  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          id: createdPost._id,
          ...createdPost,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Couldn't add post!",
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    imagePath = createImageUrl(req);
  }

  const post = createPostObject(req, imagePath);

  Post.updateOne({ _id: req.body.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Couldn't update post!",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Couldn't fetch posts!",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post deleted" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Couldn't delete post!",
      });
    });
};