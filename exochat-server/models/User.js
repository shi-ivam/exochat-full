const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true

    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
})

module.exports = mongoose.model('User', User);