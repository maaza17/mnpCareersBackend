const mongoose = require('mongoose')

jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobDepartment: {
        type: String,
        required: true
    },
    jobCountry: {
        type: String,
        required: true
    },
    jobCity: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Contractual'],
        required: true
    },
    reqExperience: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    jobRequirements: {
        type: String,
        required: true
    },
    jobIncentives: {
        type: String,
        required: true
    },
    jobStatus: {
        type: String,
        enum: ['Active', 'Closed'],
        required: false,
        default: 'Active'
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now()
    },
    createdBy: {
        type:{
            adminID: {type: mongoose.Schema.ObjectId, ref:'admin'},
            adminName: {type: String}
        },
        required: true,
        default:{adminID:null, adminName:'TestAdmin'}
    }
})

jobModel = new mongoose.model('jobListing', jobSchema)
module.exports = jobModel