const JobPost = require("../models/jobPost.model");

// 게시글 생성
exports.createJobPost = async (req, res) => {
  try {
    const { jobType, title, skillSets, content, author } = req.body;
    const jobPost = await JobPost.create({
      jobType,
      title,
      skillSets,
      content,
      author,
    });
    console.log(`JobPost created: ${jobPost.title}`);
    res.status(201).json(jobPost);
  } catch (error) {
    console.error("Error creating jobPost:", error.message);
    res.status(400).json({ error: "Failed to create jobPost" });
  }
};

// 모든 게시글 조회
exports.getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.find().populate("author", "email");
    console.log(`Fetched ${jobPosts.length} job posts`);
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error("Error fetching job posts:", error.message); // 에러 메시지만 출력
    res.status(500).json({ error: "Failed to fetch job posts" });
  }
};

// 특정 게시글 조회
exports.getJobPostById = async (req, res) => {
  try {
    const jobPost = await JobPost.findById(req.params.id).populate(
      "author",
      "email"
    );
    if (!jobPost) {
      console.log(`Job post not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Job post not found" });
    }
    console.log(`Fetched job post: ${jobPost.title}`);
    res.status(200).json(jobPost);
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// 게시글 수정
exports.updateJobPost = async (req, res) => {
  try {
    const { jobType, title, skillSets, content } = req.body;
    const jobPost = await JobPost.findByIdAndUpdate(
      req.params.id,
      { jobType, title, skillSets, content },
      { new: true }
    );
    if (!jobPost) {
      console.log(`Job post not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Job post not found" });
    }
    console.log(`Updated job post: ${jobPost.title}`);
    res.status(200).json(jobPost);
  } catch (error) {
    console.error("Error updating job post:", error.message);
    res.status(400).json({ error: "Failed to update job post" });
  }
};

// 회사별 잡 포스팅
exports.getJobPostsByCompany = async (req, res) => {
  try {
    const jobPosts = await JobPost.find({
      author: req.params.companyId,
    }).populate("author", "email");
    console.log(
      `Fetched ${jobPosts.length} job posts for company ID: ${req.params.companyId}`
    );
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error("Error fetching jobPosts by company:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch jobPosts by company" });
  }
};

// 게시글 삭제
exports.deleteJobPost = async (req, res) => {
  try {
    const jobPost = await JobPost.findByIdAndDelete(req.params.id);
    if (!jobPost) {
      console.log(`Job post not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Job post not found" });
    }
    console.log(`Deleted job post: ${jobPost.title}`);
    res.status(200).json({ message: "Job post deleted successfully" });
  } catch (error) {
    console.error("Error deleting job post:", error.message);
    res.status(500).json({ error: "Failed to delete job post" });
  }
};
