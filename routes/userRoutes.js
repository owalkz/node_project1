const express = require("express");
const router = express.Router();
const {
  getFreelancers,
  sendMessage,
  getFreelancer,
  getSpecializations,
  getCommonSpecialization,
} = require("../controllers/userController");

router.get("/", getFreelancers);
router.get("/:id", getFreelancer);
router.get("/specialization/specializations", getSpecializations);
router.get("/specialization/common", getCommonSpecialization);
router.post("/:id", sendMessage);

module.exports = router;
