const mongoose = require('mongoose')

const jobApplicationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true,
        default: ''
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    postCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
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
        type: String,
        enum: ['Shortlisted', 'Rejected', 'Contacted'],
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