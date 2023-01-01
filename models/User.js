const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "no user name"],
    minLength: [2, "user less than 2 character"],
    maxLength: [15, "user name exceed 15 characters"],
  },
  password: {
    type: String,
    required: [true, "no password found"],
    minLength: [8, "password must be 8 characters"],
    // select: false,
  },
  role: {
    type: String,
    required: [true, "no role found"],
    enum: {
      values: ["employer", "jobseeker"],
      message: "{VALUE} is not supported for role",
    },
  },
  email: {
    type: String,
    required: [true, "no email found"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide valid emails",
    ],
    // unique: true,
  },
  file: {
    type: String,
  },
  profileImg: String,
});

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
