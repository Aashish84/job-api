const Job = require("../../models/Job");

const updateJob = async (req, res, next) => {
  try {
    if (req.body.hasOwnProperty("image")) {
      delete req.body.image;
    }
    // console.log(req.body);
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

module.exports = updateJob;
