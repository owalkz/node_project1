const express = require('express');
const router = express.Router();
const { getFreelancers } = require("../controllers/userController");
const { adminLogin, adminRegister } = require("../controllers/adminContoller");

router.post('/login', adminLogin);
router.post('/register', adminRegister);
router.get('/', getFreelancers);

module.exports = router;