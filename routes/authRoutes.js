const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  resetPassword,
  forgotPassword,
  getUserProfile,
} = require("../controllers/authController");
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id", resetPassword);
router.get("/profile", getUserProfile);
module.exports = router;
