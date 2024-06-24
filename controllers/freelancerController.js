const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');
const Message = require('../model/messageModel');


// Description: This function updates a freelancer's profile
// Route: PUT /api/freelancer/update
// Access: Private
const updateProfile = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const { rate, bio, phone_number } = req.body;
        if (!rate || !bio || !phone_number) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updateData = {
            $set: {
                'freelancer_data.rate': rate,
                'freelancer_data.bio': bio,
                'freelancer_data.phone_number': phone_number
            }
        };

        const profileSet = await User.updateOne({ _id: req.user._id }, updateData);
        if (profileSet.nModified === 0) {
            return res.status(400).json({ message: 'Profile not set' });
        }

        res.status(200).json({
            message: 'Freelancer profile updated successfully',
        });
    } catch (error) {
        next(error);
    }
});

// Description: This function fetches a freelancer's messages
// Route: GET /api/freelancer/viewmessages
// Access: Private
const viewMessages = asyncHandler(async (req, res, next) => {
    const messages = await Message.find({ recipient_id: req.user._id });
    if (!messages) {
        return res.status(400).json({message: 'No messages found'});
    }
    res.status(200).json({
        message: 'Messages fetched successfully',
        messages
    });
});


module.exports = {
    updateProfile,
    viewMessages,
};