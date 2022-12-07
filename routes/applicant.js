const express = require("express");

const { addApplicant } = require("../controller/applicant");
const { jwtAuth, isJobseeker } = require("../middleware/user-auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello");
});

router.post("/", jwtAuth, isJobseeker, addApplicant);

module.exports = router;
