const mongoose = require('mongoose');

const FreelancerDataSchema = new mongoose.Schema({
    rate: {
        type: Number,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    }
}, { _id: false }); // _id: false to prevent creation of a separate _id for this subdocument

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    user_data: {
        type: Object,
        required: true
    },
    freelancer_data: {
        type: FreelancerDataSchema,
        required: false // Make it optional if it might not always be present
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
