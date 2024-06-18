const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cvSchema = new Schema({
    email: {
        type: String
    },
    jobTitle: {
        type: String
    },
    jobLocation: {
        type: String,
        required: true
    },

    personalStatement: {
        descPersonal: {
            type: String
        }
    },

    employmentHistory: {
        historyJobTitle: {
            type: String
        },
        historyCompanyName: {
            type: String
        },
        locationComp: {
            type: String
        },
        startJob: {
            type: String
        },
        endJob: {
            type: String
        },
        descJob: {
            type: String
        },
    },

    education: {
        university: {
            type: String
        },
        degree:{
            type: String
        },
        locationEduc:{
            type: String
        },
        majorEduc:{
            type: String
        },
        startEduc:{
            type: String
        },
        endEduc:{
            type: String
        },
        descEduc:{
            type: String
        }
    },

    languages: {
        language:{
            type: String
        },
        level: {
            type: String
        }
    },

    certifications:{
        titleCert:{
            type: String
        },
        startCert:{
            type: String
        },
        endCert:{
            type: String
        },
        descCert:{
            type: String
        }
    },
   
    links: {
        profileLink: {
            type: String,
        },
    },

    skills: {
        skill:{
            type: String,
        },
        experience: {
            type: String
        }
    },

    strength: {
        descrStrengh:{
            type: String
        }
    },

    cvAnalysis: {
        type: Schema.Types.Mixed
    }
}, { timestamps: true });

module.exports = mongoose.model('Cv', cvSchema);
