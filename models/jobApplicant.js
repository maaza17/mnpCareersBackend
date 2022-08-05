const mongoose = require('mongoose')

const applicantSchema = new mongoose.Schema({
    CNIC: {
        type: String,
        required: true
    },
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
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    isEmployee: {
        type: { isTrue: Boolean, employeeID: String },
        required: true,
        default: { isTrue: false, employeeID: null }
    }
})

const applicantModel = new mongoose.model('applicant', applicantSchema)
module.exports = applicantModel