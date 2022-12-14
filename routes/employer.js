const express = require("express");
const { getJobApplications, getJobs } = require("../controller/employer");
const { jwtAuth, isEmployer } = require("../middleware/user-auth");

const router = express.Router();

router.get("/job-applications/:id", jwtAuth, isEmployer, getJobApplications);
router.get("/all-jobs", jwtAuth, isEmployer, getJobs);

module.exports = router;
