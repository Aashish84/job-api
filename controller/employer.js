const { default: mongoose } = require("mongoose");
const Applicant = require("../models/Applicant");
const Job = require("../models/Job");
const { find } = require("../models/User");

const getApplications = async (req, res, next) => {
  try {
    // console.log(req.user);
    const applications = await Applicant.aggregate([
      {
        // job detail
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job_detail",
          pipeline: [
            // filter only jobs detail that is created by loggedin employer
            {
              $match: {
                created_by: mongoose.Types.ObjectId(req.user._id),
              },
            },
          ],
        },
      },
      // {
      //   $group: {
      //     _id: "$job",
      //   },
      // },
      {
        // jobseeker_detail
        $lookup: {
          from: "users",
          localField: "applied_by",
          foreignField: "_id",
          as: "jobseeker_detail",
          pipeline: [
            {
              $project: {
                password: 0,
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
      // deconstruct
      { $unwind: "$job_detail" },
      { $unwind: "$jobseeker_detail" },
      // { $group: { _id: null, uniqueValues: { $addToSet: "$job" } } },
    ]);

    res.send(applications);
  } catch (error) {
    next(error);
  }
};

const getJobs = async (req, res, next) => {
  try {
    // const jobs = await Job.find({ created_by: req.user._id });
    const jobs = await Job.aggregate([
      {
        $match: {
          created_by: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "applicants",
          localField: "_id",
          foreignField: "job",
          as: "applicants",
          // pipeline: [
          //   {
          //     $count: "$applicants",
          //   },
          // ],
        },
      },
    ]);
    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getApplications, getJobs };
