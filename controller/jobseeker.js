const Applicant = require("../models/Applicant");
const mongoose = require("mongoose");

const getApplicatons = async (req, res, next) => {
  try {
    const applications = await Applicant.aggregate([
      // match all applied_by id
      {
        $match: {
          applied_by: mongoose.Types.ObjectId(req.user._id),
        },
      },
      //   detail of job
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job_detail",
          pipeline: [
            {
              // detail of employer that posted job
              $lookup: {
                from: "users",
                localField: "created_by",
                foreignField: "_id",
                as: "employer_detail",
                pipeline: [
                  {
                    // remove employer password
                    $project: {
                      password: 0,
                    },
                  },
                ],
              },
            },
            // convert array to object
            { $unwind: "$employer_detail" },
            {
              // remove unnecessary created_by field
              $project: {
                created_by: 0,
              },
            },
          ],
        },
      },
      //   convert array to object
      { $unwind: "$job_detail" },
      //   remove
      {
        $project: {
          applied_by: 0,
          job: 0,
        },
      },
    ]);
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

module.exports = { getApplicatons };
