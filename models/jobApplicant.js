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
    isEmployee: {
        type:{ isTrue: Boolean, employeeID: String },
        required: true,
        default: { isTrue: false, employeeID:'' }
    }
})

const applicantModel = new mongoose.model('applicant', applicantSchema)
module.exports = applicantModel