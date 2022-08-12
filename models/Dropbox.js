const mongoose = require('mongoose')

const dropboxSchema = new mongoose.Schema({
    CNIC: {
        type: String,
        unique: true,
        required: true
    },
    name: {
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
    message: {
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
        enum: ['New', 'Reviewed', 'Contacted', 'Rejected'],
        required: true,
        default: 'New'
    }
})

dropboxModel = new mongoose.model('dropbox_application', dropboxSchema)
module.exports = dropboxModel