const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    password: String,
    createon: { type: Date, default: Date.now }
});

const user = mongoose.model('User', userSchema);
module.exports = user;