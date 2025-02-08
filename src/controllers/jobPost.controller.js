const Company = require("../models/company.model");
const JobPost = require("../models/jobPost.model");
const Resume = require("../models/resume.model");
const User = require("../models/user.model");

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
    const jobPosts = await JobPost.find().populate("author", "id");
    console.log(`Fetched ${jobPosts.length} job posts`);
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error("Error fetching job posts:", error.message); // 에러 메시지만 출력
    res.status(500).json({ error: "Failed to fetch job posts" });
  }
};

exports.getAppliedJobsByUserId = async (req, res) => {
  try {
    const applications = (await User.findById(req.params.userId)).applications;

    const appliedJobs = [];

    for (const application of applications) {
      const jobPost = await JobPost.findById(application.jobPost);
      appliedJobs.push({ jobPost, resume: application.resume });
    }

    res.status(200).json(appliedJobs);
  } catch (error) {
    console.error("Error fetching applied job posts by userId:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch applied job posts by userId" });
  }
};

exports.getApplicationsByJobId = async (req, res) => {
  try {
    const jobPost = await JobPost.findById(req.params.id);

    if (!jobPost) {
      console.log(`Job post not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Job post not found" });
    }

    const applications = jobPost.applications;
    const applicationArr = [];

    for (const application of applications) {
      const resume = await Resume.findById(application._id);
      if (resume) {
        console.log(resume);
        const user = await User.findById(resume.author._id);
        applicationArr.push({ user, resume });
      }
    }

    res.status(200).json(applicationArr);
  } catch (error) {
    console.error("Error fetching applied users by jobId:", error.message);
    res.status(500).json({ error: "Failed to fetch applied users by jobId" });
  }
};

// 특정 게시글 조회
exports.getJobPostById = async (req, res) => {
  try {
    const jobPost = await JobPost.findById(req.params.id).populate(
      "author",
      "id"
    );
    if (!jobPost) {
      console.log(`Job post not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Job post not found" });
    }
    const company = await Company.findById(jobPost.author._id);
    jobPost.author = company;
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
    }).populate("author", "id");
    console.log(
      `Fetched ${jobPosts.length} job posts for company ID: ${req.params.companyId}`
    );
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error("Error fetching jobPosts by company:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch jobPosts by company" });
  }
};

// SkillSet으로 잡포스트 조회
exports.getJobPostsBySkillSet = async (req, res) => {
  try {
    const jobPosts = await JobPost.find({
      skillSet: req.params.skillSet,
    }).populate("author", "id");
    console.log(
      `Fetched ${jobPosts.length} jobPosts for skillSet: ${req.params.skillSet}`
    );
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error("Error fetching jobPosts by skillSet:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch jobPosts by skillSet" });
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

// 회사에 지원
exports.applyToJobPost = async (req, res) => {
  try {
    const jobPost = await JobPost.findByIdAndUpdate(
      req.params.id,
      { $push: { applications: req.body.resumeId } },
      { new: true }
    );

    if (!jobPost) {
      console.log(`Job post not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Job post not found" });
    }

    await User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: {
          applications: { jobPost: jobPost._id, resume: req.body.resumeId },
        },
      },
      { new: true }
    );

    console.log(`Updated job post: ${jobPost.title}`);
    res.status(200).json(jobPost);
  } catch (error) {
    console.error("Error applying to job post:", error.message);
    res.status(500).json({ error: "Failed to apply to job post" });
  }
};

exports.cancelApplication = async (req, res) => {
  try {
    const jobPost = await JobPost.findByIdAndUpdate(
      req.params.id,
      { $pull: { applications: req.body.resumeId } },
      { safe: true, upsert: true }
    );

    if (!jobPost) {
      console.log(`Job post not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Job post not found" });
    }

    await User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: {
          applications: {
            jobPost: jobPost.id,
            resume: req.body.resumeId,
          },
        },
      },
      { safe: true, upsert: true }
    );

    console.log(`Updated job post: ${jobPost.title}`);
    res.status(200).json(jobPost);
  } catch (error) {
    console.error("Error applying to job post:", error.message);
    res.status(500).json({ error: "Failed to apply to job post" });
  }
};
