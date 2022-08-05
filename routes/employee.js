const router = require('express').Router()
const mongoose = require('mongoose')
const employeeModel = require('../models/Employee')


function verifyToken(token, callback) {
    jwt.verify(token, process.env.ENCRYPTION_SECRET, (err, decoded) => {
        if (err) {
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

    employeeModel.findOne({empID: empID}, {_id: true, empName: true, empID: true}, (err, employee) => {
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
            let empObjID = req.body.empID

            employeeModel.findOne({_id: empObjID}, (err, employee) => {
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

module.exports = router