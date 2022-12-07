const express = require("express");
const { getApplications, getJobs } = require("../controller/employer");
const { jwtAuth, isEmployer } = require("../middleware/user-auth");

const router = express.Router();

router.get("/all-applications", jwtAuth, isEmployer, getApplications);
router.get("/all-jobs", jwtAuth, isEmployer, getJobs);

module.exports = router;
