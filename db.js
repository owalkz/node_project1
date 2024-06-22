const Mongoose = require('mongoose');
const localDB = process.env.MONGO_URL;
const connectDB = async () => {
    await Mongoose.connect(localDB, {})
    console.log('DB connected');
}
module.exports = connectDB;