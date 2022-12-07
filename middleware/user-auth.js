const jwt = require("jsonwebtoken");
const { EMPLOYER, JOBSEEKER } = require("../constant/role");
const User = require("../models/User");

const jwtAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    // 401 - unauthorized
    return res.status(401).json({ msg: "no auth header found" });
  }

  if (!authorization.startsWith("Bearer ")) {
    // 400 - badrequest
    return res.status(400).json({ msg: "bad token" });
  }
  try {
    const token = authorization.split(" ")[1];
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.count({ _id: decoded?._id });
    if (!user) {
      return res.status(400).json({ msg: "invalid token" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return next(error);
  }
};

const isEmployer = (req, res, next) => {
  const { role } = req.user;
  // console.log(role);
  if (role !== EMPLOYER) {
    return res.status(401).json({ msg: "route not authorized" });
  }
  next();
};
const isJobseeker = (req, res, next) => {
  const { role } = req.user;
  // console.log(role);
  if (role !== JOBSEEKER) {
    return res.status(401).json({ msg: "route not authorized" });
  }
  next();
};

module.exports = { jwtAuth, isEmployer, isJobseeker };
