const express = require("express");
const { getApplicatons } = require("../controller/jobseeker");
const { jwtAuth, isJobseeker } = require("../middleware/user-auth");

const router = express.Router();

router.get("/all-application", jwtAuth, isJobseeker, getApplicatons);

module.exports = router;
