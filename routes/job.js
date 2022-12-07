const express = require("express");
const router = express.Router();

// controller
const {
  addJob,
  getJobs,
  deleteJob,
  getJob,
  updateJob,
  updateJobImg,
} = require("../controller/job");

// middleware
const { jwtAuth, isEmployer } = require("../middleware/user-auth");
const job_upload = require("../config/job_multer_config");

router.get("/", getJobs);
router.get("/:id", getJob);
// below route is protected
// authorized for employer only
router.use(jwtAuth, isEmployer);
router.post("/", job_upload, addJob);
router.route("/:id").patch(updateJob).delete(deleteJob);
router.patch("/img/:id", job_upload, updateJobImg);

module.exports = router;
