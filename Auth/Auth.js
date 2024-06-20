const User = require('../model/User');

exports.register = async (req, res, next) => {
    const {username, password} = req.body
    if (password.length < 8) {
        return res.status(400).json({message: 'Password must be at least 8 characters long'})
    }
    try {
        await User.create({
            username,
            password,
        }).then(user =>
            res.status(200).json({
                message: "User successfully created",
                user,
            })
        )
    } catch (err) {
        res.status(401).json({
            message: "User creation not successful",
            error: err.message,
        })
    }
}