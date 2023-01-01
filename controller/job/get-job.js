const { default: mongoose } = require("mongoose");
const Job = require("../../models/Job");

const getJob = async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
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
              },
            },
          ],
        },
      },
    ]);
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

module.exports = getJob;
