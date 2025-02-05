const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from_user: String,
  room: String,
  message: String,
  date_sent: { type: Date, default: Date.now }
});

const Message = mongoose.model('Group_Message', messageSchema);
module.exports = Message;