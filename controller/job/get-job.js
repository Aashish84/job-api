const Job = require("../../models/Job");

const getJob = async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

module.exports = getJob;
