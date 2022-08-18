const mongoose = require('mongoose')

const jobApplicationSchema = new mongoose.Schema({
    applicantID:{
        type: mongoose.Schema.ObjectId,
        ref: 'applicant',
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    motivationStatement: {
        type: String,
        required: true
    },
    applicationStatus: {
        type: {
            status: {type: String, enum: ['Shortlisted', 'Rejected', 'Contacted', 'New', 'Hired']},
            by: { type: mongoose.Schema.ObjectId, ref:'admin'}
        },
        default:{status:'New', by: null},
        required: true
    },
    jobRef: {
        type: mongoose.Schema.ObjectId,
        ref: 'jobListing',
        required: true
    }
})

const applicationModel = new mongoose.model('jobApplication', jobApplicationSchema)
module.exports = applicationModel