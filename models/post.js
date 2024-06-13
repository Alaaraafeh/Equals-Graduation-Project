const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    companyMail: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    jobType: {
        type: String,
    },
    salary: {
        type: String,
    },
    currency: {
        type: String,
    },
    timePeriod: {
        type: String,
    },
    companyWebsite: {
        type: String,
    },
    imageUrl: {
        type: String
    },
    companyInfo: {
        type: String,
    },
    creator: {
        name: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
