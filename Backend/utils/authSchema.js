export const registerSchema = [
  body("username").not().isEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("address").not().isEmpty().withMessage("Address is required"),
  body("phone").not().isEmpty().withMessage("Phone number is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginSchema = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

export const forgotPasswordSchema = [
  body("email").isEmail().withMessage("Please provide a valid email"),
];

export const resetPasswordSchema = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
