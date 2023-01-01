const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { EMPLOYER } = require("../constant/role");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "invalid email" });
    }

    // compare entered password and hashed password
    const isPasswordOk = await bcrypt.compare(password, user.password);
    if (!isPasswordOk) {
      return res.status(400).json({ msg: "password didnot matched" });
    }

    // removing password for token payload
    const tmp_user = user.toObject();
    delete tmp_user.password;

    const token = jwt.sign(tmp_user, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

// create user
// after sucessful creation respond jwt token
const register = async (req, res, next) => {
  let req_body = { ...req.body };

  if (req.file?.filename) {
    if (req_body.role === EMPLOYER) {
      req_body.profileImg = req.file.filename;
    } else {
      req_body.file = req.file.filename;
    }
  }

  try {
    // console.log({ req_body });

    const user = await User.create(req_body);

    // converting mongoose object to plain object
    // removing password for token payload
    const tmp_user = user.toObject();
    delete tmp_user.password;

    const token = jwt.sign(tmp_user, process.env.JWT_SECRET);
    res.status(200).json({ token });
    // res.send("hlo");
  } catch (error) {
    if (req_body.file) {
      // move file to bin folder
      const oldPath = `${__dirname}/../uploads/user_uploads/${req_body.file}`;
      const newPath = `${__dirname}/../uploads/bin/${req_body.file}`;

      fs.rename(oldPath, newPath, function (err) {
        if (err) throw err;
        console.log("Successfully renamed - AKA moved!");
      });
    }
    next(error);
  }
};

// get user of provided token
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, getUser };
