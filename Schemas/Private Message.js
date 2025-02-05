const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from_user: String,
  to_user: String,
  room: String,
  text: String,
  date_sent: { type: Date, default: Date.now }
});

const Message = mongoose.model('Private_Message', messageSchema);
module.exports = Message;