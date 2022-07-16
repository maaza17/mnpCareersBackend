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
    jobLocation: {
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
        required: true,
        default: 'Active'
    }
})

jobModel = new mongoose.model('jobListing', jobSchema)
module.exports = jobModel