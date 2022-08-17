const router = require('express').Router()
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const employeeModel = require('../models/Employee')


function verifyToken(token, callback) {
    jwt.verify(token, process.env.ENCRYPTION_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            return callback({
                isAdmin: false,
                err: err,
                message: err.message,
            });
        } else if (decoded) {
            return callback({
                isAdmin: true,
                id: decoded.id,
                name: decoded.name
            })
        } else {
            return callback(null);
        }
    })
}


router.post('/isEmployee', (req, res) => {

    let empID = req.body.empID

    employeeModel.findOne({empid: empID}, {_id: true, empname: true, empdesignation: true, empid: true}, (err, employee) => {
        if(err){
            return res.status(200).json({
                error: true,
                message: err.message
            })
        } else if(!employee){
            return res.status(200).json({
                error: true,
                message: "Employee does not exist."
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Employee found succesfully.",
                data: employee
            })
        }
    })

})

router.post('/getEmployeeDetails', (req, res) => {

    verifyToken(req.body.token, (item) => {
        const isAdmin = item.isAdmin;
        const id = item.id;
        const name = item.name;
        if (!isAdmin) {
            return res.status(200).json({
                error: true,
                message: 'Access denied. Limited for admin(s).'
            })
        } else {
            let empID = req.body.empID

            employeeModel.findOne({_id: empID}, (err, employee) => {
                if(err){
                    return res.status(200).json({
                        error: true,
                        message: err.message
                    })
                } else if(!employee){
                    return res.status(200).json({
                        error: false,
                        message: "Employee does not exist."
                    })
                } else {
                    return res.status(200).json({
                        error: false,
                        message: "Employee found succesfully.",
                        data: employee
                    })
                }
            })
        }
    })
})

router.post('/bulkRewriteEmployees', (req, res) => {
    console.log(req.body.token)
    verifyToken(req.body.token, (item) => {
        const isAdmin = item.isAdmin;
        const id = item.id;
        const name = item.name;
        if (!isAdmin) {
            return res.status(200).json({
                error: true,
                message: 'Access denied. Limited for admin(s).'
            })
        } else {
            let empArray = req.body.empArray
            console.log(empArray.length)
            console.log(empArray[5])
            employeeModel.deleteMany({})
            .then(() => {
                employeeModel.insertMany(empArray, (err, docs) => {
                    if(err){
                        return res.status(200).json({
                            error: true,
                            text:err,
                            message: 'An unexpected error occured. Please try again later.'
                        })
                    } else {
                        return res.status(200).json({
                            error: false,
                            message: 'Employee list successfully updated.'
                        })
                    }
                })
            })
            .catch((delErr) => {
                if(delErr){
                    return res.status(200).json({
                        error: true,
                        message: 'An unexpected error occured. Please try again later.'
                    })
                }
            })
        }
    })
})

module.exports = router