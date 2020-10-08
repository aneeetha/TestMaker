const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    usertype: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student'
    },
    username: String
});

module.exports = mongoose.model('User', userSchema);