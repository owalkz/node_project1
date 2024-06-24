const express = require('express');
const router = express.Router();
const { getFreelancers, sendMessage } = require('../controllers/userController');

router.get('/', getFreelancers);
router.post('/:id', sendMessage);

module.exports = router;