const Mongoose = require("mongoose");

const messageSchema = Mongoose.Schema({
  recipient_id: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Message", messageSchema);
