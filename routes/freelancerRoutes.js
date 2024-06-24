const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { updateProfile, viewMessages } = require('../controllers/freelancerController');

router.put('/update', protect, updateProfile);
router.get('/viewmessages', protect, viewMessages);

module.exports = router;