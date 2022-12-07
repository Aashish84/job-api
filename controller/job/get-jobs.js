const Job = require("../../models/Job");

const getJobs = async (req, res, next) => {
  const { page = 1, limit = 3 } = req.query;

  try {
    const jobs_count = await Job.count();
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "employer",
          pipeline: [
            {
              $project: {
                password: 0,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $project: {
          created_by: 0,
        },
      },
      {
        $skip: limit * (page - 1),
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    const total_page = Math.ceil(jobs_count / parseInt(limit));

    res.status(200).json({
      total_avilable: jobs_count,
      total_present: jobs.length,
      total_page,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getJobs;
