const Post = require("../models/post.model");

// 게시글 생성
exports.createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const post = await Post.create({ title, content, author });
    console.log(`Post created: ${post.title}`); // 제목만 출력
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error.message); // 에러 메시지만 출력
    res.status(400).json({ error: "Failed to create post" });
  }
};

// 모든 게시글 조회
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "email");
    console.log(`Fetched ${posts.length} posts`); // 총 개수만 출력
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message); // 에러 메시지만 출력
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// 특정 게시글 조회
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "email");
    if (!post) {
      console.log(`Post not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Post not found" });
    }
    console.log(`Fetched post: ${post.title}`); // 제목만 출력
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error.message); // 에러 메시지만 출력
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// 게시글 수정
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!post) {
      console.log(`Post not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Post not found" });
    }
    console.log(`Updated post: ${post.title}`); // 제목만 출력
    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error.message); // 에러 메시지만 출력
    res.status(400).json({ error: "Failed to update post" });
  }
};

// 게시글 삭제
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      console.log(`Post not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Post not found" });
    }
    console.log(`Deleted post: ${post.title}`); // 제목만 출력
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error.message); // 에러 메시지만 출력
    res.status(500).json({ error: "Failed to delete post" });
  }
};
