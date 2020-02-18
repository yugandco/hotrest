const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    sname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean
    }
});

let User = module.exports = mongoose.model('User', userSchema); 