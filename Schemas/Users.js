const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true},
    firstname: String,
    lastname: String,
    password: String,
    createon: { type: Date, default: Date.now }
});

const user = mongoose.model('User', userSchema);
module.exports = user;