// import mongoose from 'mongoose';
// import uuid from 'uuid';
const mongoose = require('mongoose');
const uuid = require('uuid');

// create chat model
const chatSchema = mongoose.Schema({
    message: String,
    id: {
        type: String,
        required: true,
        unique: true
    },
    videoTime: {
        type: Number,
        required: true,
    },
    owner: String,
    videoId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Chat', chatSchema);