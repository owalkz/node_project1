const User = require('../model/userModel');
const Message = require('../model/messageModel');
const asyncHandler = require('express-async-handler');

// Description: This function gets all freelancers
// Route: GET /api/freelancers
// Access: Public
const getFreelancers = asyncHandler(async (req, res, next) => {
    try {
        const freelancers = await User.find();
        const cleaned_freelancers = freelancers.map(freelancer => {
        // Remove the password field from the freelancer object
        delete freelancer.password;

        if (freelancer.user_type === 'business' && !freelancer.freelancer_data) {
            return {
                user_type: freelancer.user_type,
                _id: freelancer._id,
                business_name: freelancer.user_data.business_name,
                email: freelancer.email,
                username: freelancer.username
            };
        } else if (freelancer.user_type === 'business' && freelancer.freelancer_data) {
            return {
                user_type: freelancer.user_type,
                _id: freelancer._id,
                business_name: freelancer.user_data.business_name,
                email: freelancer.email,
                username: freelancer.username,
                rate: freelancer.freelancer_data.rate,
                bio: freelancer.freelancer_data.bio,
                phone_number: freelancer.freelancer_data.phone_number,
                specialization: freelancer.freelancer_data.specialization
            };
        } else if (freelancer.user_type === 'individual') {
            return {
                user_type: freelancer.user_type,
                _id: freelancer._id,
                first_name: freelancer.user_data.first_name,
                last_name: freelancer.user_data.last_name,
                email: freelancer.email,
                username: freelancer.username
            };
        } else if (freelancer.user_type === 'individual' && freelancer.freelancer_data) {
            return {
                user_type: freelancer.user_type,
                _id: freelancer._id,
                first_name: freelancer.user_data.first_name,
                last_name: freelancer.user_data.last_name,
                email: freelancer.email,
                username: freelancer.username,
                rate: freelancer.freelancer_data.rate,
                bio: freelancer.freelancer_data.bio,
                phone_number: freelancer.freelancer_data.phone_number,
                specialization: freelancer.freelancer_data.specialization
            };
        }
    });
    return res.status(200).json(cleaned_freelancers);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

// Description: This function sends a message to a freelancer
// Route: POST /api/freelancers/message
// Access: Public
const sendMessage = asyncHandler(async (req, res, next) => {
    const { message } = req.body;
    const recipient_id = req.params.id;
    if (!recipient_id || !message) {
        return res.status(400).json({message: 'All fields are required'});
    }
    const newMessage = await Message.create({
        recipient_id,
        message
    });
    if (!newMessage) {
        return res.status(500).json({message: 'Message not sent'});
    }
    return res.status(201).json({
        message: 'Message sent successfully',
        newMessage
    });
});

const getFreelancer = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({message: 'Freelancer ID is required'});
    }
    const freelancer = await User.findById(id);
    if (!freelancer) {
        return res.status(404).json({message: 'Freelancer not found'});
    }
    if (freelancer.freelancer_data && freelancer.user_type === 'business') {
        return res.status(200).json({
            user_type: freelancer.user_type,
            _id: freelancer._id,
            first_name: freelancer.user_data.first_name,
            last_name: freelancer.user_data.last_name,
            email: freelancer.email,
            username: freelancer.username,
            rate: freelancer.freelancer_data.rate,
            bio: freelancer.freelancer_data.bio,
            phone_number: freelancer.freelancer_data.phone_number,
            specialization: freelancer.freelancer_data.specialization    
        });
    } else if (!freelancer.freelancer_data && freelancer.user_type === 'business') {
        return res.status(200).json({
            user_type: freelancer.user_type,
            _id: freelancer._id,
            business_name: freelancer.user_data.business_name,
            email: freelancer.email,
        });
    } else if (freelancer.freelancer_data && freelancer.user_type === 'individual') {
        return res.status(200).json({
            user_type: freelancer.user_type,
            _id: freelancer._id,
            first_name: freelancer.user_data.first_name,
            last_name: freelancer.user_data.last_name,
            email: freelancer.email,
            username: freelancer.username,
            rate: freelancer.freelancer_data.rate,
            bio: freelancer.freelancer_data.bio,
            phone_number: freelancer.freelancer_data.phone_number,
            specialization: freelancer.freelancer_data.specialization
        });
    } else if (!freelancer.freelancer_data && freelancer.user_type === 'individual') {
        return res.status(200).json({
            user_type: freelancer.user_type,
            _id: freelancer._id,
            first_name: freelancer.user_data.first_name,
            last_name: freelancer.user_data.last_name,
            email: freelancer.email,
            username: freelancer.username
        });
    }
});

module.exports = { getFreelancers, sendMessage, getFreelancer };