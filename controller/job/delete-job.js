const Applicant = require("../../models/Applicant");
const Job = require("../../models/Job");
var fs = require("fs");

// delete job
// move image to bin folder
// delete all applicants of deleted job
const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    // delete job
    const job = await Job.findByIdAndDelete(id);

    // move job image to bin folder
    const oldPath = `${__dirname}/../../uploads/job_uploads/${job.image}`;
    const newPath = `${__dirname}/../../uploads/bin/${job.image}`;

    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err;
      console.log("Successfully renamed - AKA moved!");
    });

    // delete applicant of deleted job
    const applicant = await Applicant.deleteMany({ job: id });

    // if job found of id and deleted
    if (job) {
      return res.status(200).json({
        deleted_job: job.title,
        deleted_applicant: applicant.deletedCount,
      });
    }

    res.status(200).json({ msg: "no job to delete" });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteJob;
