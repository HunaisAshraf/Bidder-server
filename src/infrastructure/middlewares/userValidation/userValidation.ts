import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail().withMessage("Email must be provided"),
  body("password").notEmpty().withMessage("password must be provided"),
];

export const signupValidator = [
  body("email").isEmail().withMessage("Email must be provided"),
  body("password")
    .escape()
    .notEmpty()
    .withMessage("password must be provided")
    .isLength({ min: 8, max: 15 })
    .withMessage("password must be 8-15 char length")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}/
    )
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
];
