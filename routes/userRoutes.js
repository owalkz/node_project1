const express = require("express");
const router = express.Router();
const {
  getFreelancers,
  sendMessage,
  getFreelancer,
} = require("../controllers/userController");
const {
  getFreelancers,
  sendMessage,
  getFreelancer,
} = require("../controllers/userController");

router.get("/", getFreelancers);
router.get("/:id", getFreelancer);
router.post("/:id", sendMessage);
router.get("/", getFreelancers);
router.get("/:id", getFreelancer);
router.post("/:id", sendMessage);

module.exports = router;
