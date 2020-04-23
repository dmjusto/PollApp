const mongoose = require('mongoose');

//SCHEMA SETUP
const Poll = new mongoose.Schema({
    title: String,
    options: [String],
    author: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Poll", Poll);