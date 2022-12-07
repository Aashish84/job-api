const mongoose = require("mongoose");
const { JOBSEEKER } = require("../constant/role");
const User = require("./User");

const ApplicantSchema = new mongoose.Schema({
  applied_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "no user found"],
    validator: {
      validate: async function (value) {
        const user = await User.findById(value);
        if (Object.keys(user).length === 0) {
          return false;
        }
        if (user.role != JOBSEEKER) {
          return false;
        }
        return true;
      },
      message: "invalid user",
    },
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "no job to apply"],
  },
});

module.exports = mongoose.model("Applicant", ApplicantSchema);
