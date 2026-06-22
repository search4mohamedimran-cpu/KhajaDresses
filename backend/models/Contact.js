const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', ContactSchema);
