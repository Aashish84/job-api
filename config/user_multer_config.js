const multer = require("multer");
const path = require("path");
const { JOBSEEKER, EMPLOYER } = require("../constant/role");

// custom storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/user_uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const user_upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    // check file is set or not
    // if set then role should be set then
    // let jobseeker upload .pdf and employer .jpeg
    if (Object.keys(file).length > 0) {
      let req_body = { ...req.body };
      // console.log({ file }, 1);

      // console.log(req_body);

      let check_mimeType = "";
      if (Object.keys(req_body).length <= 0 || !req_body.role) {
        callback("role required to upload file", false);
        return;
      }

      if (req_body.role === JOBSEEKER) {
        check_mimeType = "application/pdf";
      } else if (req_body.role === EMPLOYER) {
        check_mimeType = "image/jpeg";
      } else {
        callback("some thing went wrong", false);
        return;
      }
      // console.log(check_mimeType);

      const mimeType = file.mimetype;
      // console.log(mimeType);
      if (mimeType === check_mimeType) {
        callback(null, true);
      } else {
        callback(`only ${check_mimeType} file type is allowed`, false);
      }
    }
  },
}).single("avatar");

module.exports = user_upload;
