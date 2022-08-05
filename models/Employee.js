const mongoose = require('mongoose')

employeeSchema = new mongoose.Schema({
    empID: {
        type: String,
        required: true,
        unique: true
    },
    empName: {
        type: String,
        required: true
    },
    empDesignation: {
        type: String,
        required: true
    },
    empGrade: {
        type: String,
        required: true
    },
    empDivision: {
        type: String,
        required: true
    },
    empLineManagerID: {
        type: String,
        required: true
    },
    empLineManagerName: {
        type: String,
        required: true
    }
})

const employeeModel = new mongoose.model('employee', employeeSchema)

module.exports = employeeModel