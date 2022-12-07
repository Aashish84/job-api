const express = require("express");

const { login, register, getUser } = require("../controller/auth.js");
const {
  registerValidationMiddleware,
  loginValidationMiddleware,
} = require("../middleware/user-body-auth");
const { jwtAuth } = require("../middleware/user-auth");
const user_upload = require("../config/user_multer_config.js");

const router = express.Router();

router.post("/login", loginValidationMiddleware, login);
// router.post("/register", registerValidationMiddleware, register);
router.post("/register", user_upload, register);
router.get("/get-user", jwtAuth, getUser);

module.exports = router;
