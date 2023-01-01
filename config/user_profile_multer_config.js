const multer = require("multer");
const path = require("path");

// custom storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/user_uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const user_profileimg_upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const mimeType = file.mimetype;
    // console.log(mimeType);
    if (mimeType === "image/jpeg" || mimeType === "image/png") {
      callback(null, true);
    } else {
      callback("this file type not allowed", false);
    }
  },
}).single("profileimg");

module.exports = user_profileimg_upload;
