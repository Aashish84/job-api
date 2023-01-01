const mongoose = require("mongoose");
const User = require("./User");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "no job title found"],
      minLength: [2, "title less than 2"],
    },
    image: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "no user found"],
      validate: {
        validator: async function (value) {
          const user = await User.findById(value);
          if (!user) {
            return false;
          }
          return true;
        },
        message: "user not found",
      },
    },
    expire_date: {
      type: Date,
      required: [true, "no expire_date"],
      validate: {
        validator: function (value) {
          const now = new Date();
          // console.log({now});
          // console.log({value});
          const tmp = value - now;
          if (tmp < 0) {
            return false;
          }
          return true;
        },
        message: "date must be greater than today",
      },
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
