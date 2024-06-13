const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employerSchema = new Schema({
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
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Employer', employerSchema);
