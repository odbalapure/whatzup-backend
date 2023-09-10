const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  eventId: String,
  room: String,
  author: String,
  email: String,
  message: String,
  time: String,
  msgId: String,
});

module.exports = mongoose.model("Message", MessageSchema);
