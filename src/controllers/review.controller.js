const Review = require("../models/review.model");

// 리뷰 생성
exports.createReview = async (req, res) => {
  try {
    const { stars, content, companyId, authorId } = req.body;
    const review = await Review.create({
      stars,
      content,
      company: companyId,
      author: authorId,
    });

    console.log(`Review created with ID: ${review._id}`); // 생성된 댓글 ID 출력
    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error.message); // 에러 메시지 출력
    res.status(400).json({ error: "Failed to create review" });
  }
};

// 특정 리뷰 조회
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate("author", "email")
      .populate("company", "title");
    if (!review) {
      console.log(`Review not found with ID: ${req.params.reviewId}`);
      return res.status(404).json({ error: "Review not found" });
    }
    console.log(`Fetched review with ID: ${review._id}`); // ID 출력
    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch review" });
  }
};

// 리뷰 수정
exports.updateReview = async (req, res) => {
  try {
    const { stars, content } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.commentId,
      { stars, content },
      { new: true }
    );
    if (!review) {
      console.log(`Review not found with ID: ${req.params.reviewId}`);
      return res.status(404).json({ error: "Review not found" });
    }
    console.log(`Updated review with ID: ${review._id}`); // 수정된 댓글 ID 출력
    res.status(200).json(review);
  } catch (error) {
    console.error("Error updating review:", error.message); // 에러 메시지 출력
    res.status(400).json({ error: "Failed to update review" });
  }
};

// 리뷰 삭제
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (!review) {
      console.log(`Review not found with ID: ${req.params.reviewId}`);
      return res.status(404).json({ error: "Review not found" });
    }
    console.log(`Deleted review with ID: ${review._id}`); // 삭제된 댓글 ID 출력
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to delete review" });
  }
};

// 특정 회사의 리뷰 가져오기
exports.getReviewsByCompany = async (req, res) => {
  try {
    const reviews = await Review.find({
      company: req.params.companyId,
    }).populate("author", "email");
    console.log(
      `Fetched ${reviews.length} reviews for company ID: ${req.params.companyId}`
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by company:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch reviews by company" });
  }
};

// 특정 게시물의 리뷰 개수 조회
// exports.getCommentCountByPost = async (req, res) => {
//   try {
//     const commentCount = await Comment.countDocuments({
//       post: req.params.postId,
//     });
//     console.log(
//       `Comment count for post ID ${req.params.postId}: ${commentCount}`
//     ); // 댓글 개수 출력
//     res.status(200).json({ postId: req.params.postId, commentCount });
//   } catch (error) {
//     console.error("Error fetching comment count:", error.message); // 에러 메시지 출력
//     res.status(500).json({ error: "Failed to fetch comment count" });
//   }
// };
