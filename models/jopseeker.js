const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSeekerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    confirmEmail: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    disability: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('JobSeeker', jobSeekerSchema);
