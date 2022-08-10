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
    jobCity: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Permanent', 'Contractual'],
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
    jobSalary: {
        type: String,
        required: false,
        default:"Not Available"
    },
    jobStatus: {
        type: String,
        enum: ['Active', 'Closed'],
        required: false,
        default: 'Active'
    },
    forEmployees: {
        type: Boolean,
        required: false,
        default: false
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