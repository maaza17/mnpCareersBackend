const router = require('express').Router()
const mongoose = require('mongoose')
const adminModel = require('../../models/admin/Admin')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const {validateAdminLoginInput, validateAdminRegisterInput} = require('../../validation/adminAuthValidation')

router.post('/loginAdmin', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    const { errors, isValid } = validateAdminLoginInput({email, password});

    // Check validation
    console.log('input validation')
    if (!isValid) {
        return res.status(200).json({
        error: true,
        error_message: errors,
        message: "Input validation failed. Check error messages."
        });
    }

    adminModel.findOne({email: email}, (err, admin) => {
        if(err){
            return res.status(200).json({
                error: true,
                message: err.message
            })
        } else if(admin){
            // compare passwords and token generation here
            bcrypt.compare(password, admin.password).then((isMatch) => {
                if(isMatch){
                    console.log('admin password match')
                    const payload = {
                        id: admin._id,
                        email: admin.email,
                        name: admin.name
                    }
    
                    // sign Token
                    jwt.sign(payload, process.env.ENCRYPTION_SECRET, {expiresIn: 86400}, (signErr, adminToken) => {
                        if(admin.admin_sign_err){
                            console.log('admin token sign error')
                            return res.status.json({
                                error: true,
                                message: "An unexpected error occured. Please try again"
                            })
                        } else {
                            console.log('admin login success')
                            return res.status(200).json({
                                error: false,
                                token: adminToken,
                                userType: "Admin"
                              });
                        }
                    })
                } else {
                    return res.status(200).json({
                        error: true,
                        message: "Incorrect password. Please retry."
                    })
                } 
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Admin does not exist. Please recheck your credentials'
            })
        }
    })
})


router.post('/registerAdmin', (req, res) => {
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password

    const { errors, isValid } = validateAdminRegisterInput({name, email, password})

    // Check validation
    console.log('input validation')
    if (!isValid) {
        return res.status(200).json({
        error: true,
        error_message: errors,
        message: "Input validation failed. Check error messages."
        })
    }

    let newAdmin = new adminModel({
        name: name,
        email: email,
        password: password
    })

    bcrypt.genSalt(10, (err, salt) => {
        // console.log('gen salt error')
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            // console.log(err, "hashing error")
            newAdmin.password = hash
            newAdmin.save()
                .then((doc) => {
                    return res.status(200).json({
                        error: false,
                        message: "Admin successfully registered",
                        data: doc
                    })
                })
                .catch((err) => {
                    return res.status(200).json({
                        error: true,
                        message: err.message
                    })
                })
        })
    })

})


module.exports = router