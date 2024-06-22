const Mongoose = require('mongoose');
const UserSchema = new Mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        unique: true
    },
    last_name: {
        type: String,
        required: true,
    },
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
});

const User = Mongoose.model('User', UserSchema);
module.exports = User;