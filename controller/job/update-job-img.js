const Job = require("../../models/Job");
const fs = require("fs");

// move file from job_upload folder to bin
const move_file = (img) => {
  // move job image to bin folder
  const oldPath = `${__dirname}/../../uploads/job_uploads/${img}`;
  const newPath = `${__dirname}/../../uploads/bin/${img}`;

  fs.rename(oldPath, newPath, function (err) {
    if (err) throw err;
    console.log("Successfully renamed - AKA moved!");
  });
};

// update job image only
const updateJobImg = async (req, res, next) => {
  try {
    if (req.file?.filename) {
      const job = await Job.findById(req.params.id);
      // if on job found then move uploaded file to bin
      if (Object.keys(job).length !== 0) {
        move_file(job.image);
      } else {
        move_file(req.file.filename);
      }

      const new_job = await Job.findByIdAndUpdate(
        req.params.id,
        { image: req.file.filename },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json(new_job);
    }
    return res.status(400).json({ msg: "no image found" });
  } catch (error) {
    // console.log(error.name);
    if (error.name === "CastError") {
      move_file(req.file?.filename);
    }
    next(error);
  }
};

module.exports = updateJobImg;
