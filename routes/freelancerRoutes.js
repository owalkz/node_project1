const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  updateProfile,
  viewMessages,
  deleteAccount,
} = require("../controllers/freelancerController");

router.put("/update", protect, updateProfile);
router.get("/viewmessages", protect, viewMessages);
router.post("/delete/:id", protect, deleteAccount);

module.exports = router;
