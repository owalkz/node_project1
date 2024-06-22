const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    const {first_name, last_name, email, password} = req.body
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({message: 'All fields are required'});
    }
    if (password.length < 8) {
        return res.status(400).json({message: 'Password must be at least 8 characters long'})
    }
    const email_exists = User.findOne({email});
    if (email_exists) {
        return res.status(400).json({message: 'Email already exists'});
    }
    try {
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({error: err.message})
            }
            await User.create({
                first_name,
                last_name,
                email,
                password: hash
            }).then(user =>
                res.status(200).json({
                    message: "User successfully created",
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                })
            )
        })
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: "User creation not successful",
            error: err.message,
        })
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
                _id: user._id
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