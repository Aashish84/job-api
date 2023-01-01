const User = require("../../models/User");
const fs = require("fs");

const updateProifleImg = async (req, res, next) => {
  try {
    const filename = req.file?.filename;
    if (!filename) {
      return res.status(400).json({ msg: "no file found" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
      profileImg: filename,
    });

    if (user.profileImg) {
      // move file
      const oldPath = `${__dirname}/../../uploads/user_uploads/${user.profileImg}`;
      const newPath = `${__dirname}/../../uploads/bin/${user.profileImg}`;

      fs.rename(oldPath, newPath, function (err) {
        if (err) throw err;
        console.log("Successfully renamed - for profileImg");
      });
    }
    res.send(await User.findById(req.user._id).select("-password"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { updateProifleImg };
