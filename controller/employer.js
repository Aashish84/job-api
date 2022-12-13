const { default: mongoose } = require("mongoose");
const Applicant = require("../models/Applicant");
const Job = require("../models/Job");

const getJobApplications = async (req, res, next) => {
  try {
    const jobs = await Job.aggregate([
      // match job id
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      // from applicant table
      {
        $lookup: {
          from: "applicants",
          localField: "_id",
          foreignField: "job",
          as: "applicants",
          pipeline: [
            {
              // user detail of applicant table
              $lookup: {
                from: "users",
                localField: "applied_by",
                foreignField: "_id",
                as: "applied_by_detail",
                pipeline: [
                  {
                    $project: {
                      password: 0,
                      role: 0,
                      _id: 0,
                      __v: 0,
                    },
                  },
                ],
              },
            },
            {
              $unwind: "$applied_by_detail",
            },
            {
              $project: {
                job: 0,
                applied_by: 0,
                __v: 0,
              },
            },
          ],
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
    res.status(200).json(jobs);
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.aggregate([
      // match job id
      {
        $match: {
          created_by: mongoose.Types.ObjectId(req.user._id),
        },
      },
      // from applicant table
      {
        $lookup: {
          from: "applicants",
          localField: "_id",
          foreignField: "job",
          as: "applicants",
          pipeline: [
            {
              $project: {
                job: 0,
                applied_by: 0,
                __v: 0,
              },
            },
          ],
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getJobApplications, getJobs };
