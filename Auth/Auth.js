const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    const { username, email, password, user_type, user_data = {} } = req.body;
    if (!username || !email || !password || !user_type || !user_data) {
        return res.status(400).json({message: 'All fields are required'});
    }
    if (password.length < 8) {
        return res.status(400).json({message: 'Password must be at least 8 characters long'});
    }
    const email_exists = await User.findOne({email});
    if (email_exists) {
        return res.status(400).json({message: 'Email already exists'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (user_type === 'individual') {
        const { first_name, last_name } = user_data[0];
        const user = User.create({
            username,
            email,
            password: hashedPassword,
            user_type,
            user_data: {
                first_name,
                last_name
            }
        });
        return res.status(201).json({
            message: 'User created successfully',
            first_name,
            last_name,
            username,
            email,
            user_type
        });
    } else if (user_type === 'business') {
        const { business_name } = user_data[0];
        const user = User.create({
            username,
            email,
            password: hashedPassword,
            user_type,
            user_data: {
                business_name,
            }
        });
        return res.status(201).json({
            message: 'User created successfully',
            business_name,
            username,
            email,
            user_type
        });
    }
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'All fields are required'});
    }
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(422).json({message: 'Invalid credentials, please try again!'});
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({error: err.message});
            }
            if (!isMatch) {
                return res.status(400).json({message: 'Invalid credentials'});
            }
            const userObject = {
                email: user.email,
                _id: user._id,
                user_type: user.user_type,
            }
            const token = jwt.sign(userObject, process.env.JWT_SECRET, {expiresIn: '1h'});
            res.status(200).json({message: 'Login successful', token: token, user: userObject});
        })
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: "Login not successful",
            error: err.message,
        })
    }
}