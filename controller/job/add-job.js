const Job = require("../../models/Job");

const addJob = async (req, res, next) => {
  try {
    const req_body = { ...req.body };
    req_body.image = req.file.filename;
    // console.log(req_body);
    req_body.created_by = req.user._id;
    // req_body.created_by = 123
    const job = await Job.create(req_body);
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

module.exports = addJob;
