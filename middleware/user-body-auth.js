const validate = require("../config/validate");
const { body, checkSchema } = require("express-validator");

// to check valid role
// https://stackoverflow.com/questions/41289980/match-string-with-values-from-array-in-express-validation
let roleSchema = {
  role: {
    in: "body",
    matches: {
      options: [/\b(employer|jobseeker)\b/],
      errorMessage: "invalid role",
    },
  },
};

const registerValidationMiddleware = validate([
  body("name")
    .exists()
    .withMessage("required")
    .isLength({ min: 2 })
    .withMessage("name is less than 2")
    .isString()
    .withMessage("name must be string"),
  body("password")
    .exists()
    .withMessage("required")
    .isLength({ min: 8 })
    .withMessage("password is less than 8 characters"),
  body("role").exists().withMessage("required"),
  body("email")
    .exists()
    .withMessage("required")
    .isEmail()
    .withMessage("invalid email"),
  checkSchema(roleSchema),
]);

const loginValidationMiddleware = validate([
  body("email")
    .exists()
    .withMessage("required")
    .isEmail()
    .withMessage("invalid email"),
  body("password")
    .exists()
    .withMessage("required")
    .isLength({ min: 8 })
    .withMessage("password is less than 8 characters"),
]);

module.exports = { registerValidationMiddleware, loginValidationMiddleware };
