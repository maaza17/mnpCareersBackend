const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Suspended', 'Active', 'Deactivated'],
        required: false,
        default: "Active"
    }
})

//Something I(Haris) made to integrate on frontend. Feel free to change/add other details

const adminModel = new mongoose.model('admin', AdminSchema)
module.exports = adminModel