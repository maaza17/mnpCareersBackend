const mongoose = require('mongoose')

const dropboxSchema = new mongoose.Schema({
    CNIC: {
        type: String,
        unique: true,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    motivationStatement: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        required: true
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Rejected'],
        required: true,
        default: 'New'
    }
})

dropboxModel = new mongoose.model('dropbox_application', dropboxSchema)
module.exports = dropboxModel