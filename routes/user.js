const express = require("express");
const user_profileimg_upload = require("../config/user_profile_multer_config");

const { updateProifleImg } = require("../controller/user/user");
const { jwtAuth } = require("../middleware/user-auth");

const router = express.Router();

router.patch("/profileimg", jwtAuth, user_profileimg_upload, updateProifleImg);

module.exports = router;
