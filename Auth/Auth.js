const User = require('../model/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
    const {username, password} = req.body
    if (password.length < 8) {
        return res.status(400).json({message: 'Password must be at least 8 characters long'})
    }
    try {
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({error: err.message})
            }
            await User.create({
                username,
                password: hash
            }).then(user =>
                res.status(200).json({
                    message: "User successfully created",
                    username: user.username,
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