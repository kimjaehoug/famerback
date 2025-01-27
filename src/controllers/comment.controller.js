const Comment = require("../models/comment.model");

// 댓글 생성
exports.createComment = async (req, res) => {
  try {
    const { content, postId, authorId } = req.body;
    const comment = await Comment.create({ content, post: postId, author: authorId });

    console.log(`Comment created with ID: ${comment._id}`); // 생성된 댓글 ID 출력
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error.message); // 에러 메시지 출력
    res.status(400).json({ error: "Failed to create comment" });
  }
};

// 모든 댓글 조회
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("author", "email").populate("post", "title");
    console.log(`Fetched ${comments.length} comments`); // 총 개수 출력
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// 특정 댓글 조회
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate("author", "email")
      .populate("post", "title");
    if (!comment) {
      console.log(`Comment not found with ID: ${req.params.commentId}`);
      return res.status(404).json({ error: "Comment not found" });
    }
    console.log(`Fetched comment with ID: ${comment._id}`); // ID 출력
    res.status(200).json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch comment" });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content },
      { new: true }
    );
    if (!comment) {
      console.log(`Comment not found with ID: ${req.params.commentId}`);
      return res.status(404).json({ error: "Comment not found" });
    }
    console.log(`Updated comment with ID: ${comment._id}`); // 수정된 댓글 ID 출력
    res.status(200).json(comment);
  } catch (error) {
    console.error("Error updating comment:", error.message); // 에러 메시지 출력
    res.status(400).json({ error: "Failed to update comment" });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      console.log(`Comment not found with ID: ${req.params.commentId}`);
      return res.status(404).json({ error: "Comment not found" });
    }
    console.log(`Deleted comment with ID: ${comment._id}`); // 삭제된 댓글 ID 출력
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

// 특정 게시물의 댓글 가져오기
exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate("author", "email");
    console.log(`Fetched ${comments.length} comments for post ID: ${req.params.postId}`); // 댓글 수 출력
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments by post:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch comments by post" });
  }
};

// 특정 게시물의 댓글 개수 조회
exports.getCommentCountByPost = async (req, res) => {
  try {
    const commentCount = await Comment.countDocuments({ post: req.params.postId });
    console.log(`Comment count for post ID ${req.params.postId}: ${commentCount}`); // 댓글 개수 출력
    res.status(200).json({ postId: req.params.postId, commentCount });
  } catch (error) {
    console.error("Error fetching comment count:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch comment count" });
  }
};
