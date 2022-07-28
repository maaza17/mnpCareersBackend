const router = require('express').Router()
const mongoose = require('mongoose')
const applicationModel = require('../models/JobApplication')
const applicantModel = require('../models/JobApplicant')
const validateJobApplication = require('../validation/jobApplicationValidation')
const jwt = require("jsonwebtoken")

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

router.post('/apply', (req, res) => {

    let {
        CNIC, firstName, middleName, lastName, email, phone, address, city,
        province, postCode, country, isEmployee, resume, motivationStatement, jobRef
    } = req.body

    const { errors, isValid } = validateJobApplication({
        CNIC: CNIC, firstName: firstName, middleName: middleName, lastName: lastName, email: email,
        phone: phone, address: address, city: city, province: province, postCode: postCode,
        country: country, resume: resume, motivationStatement: motivationStatement
    });

    // Check validation
    console.log('input validation')
    if (!isValid) {
        return res.status(200).json({
            error: true,
            error_message: errors,
            message: "Input validation failed. Check error messages."
        });
    }

    applicantModel.findOne({ CNIC: CNIC }, (applicantErr, applicant) => {
        if (applicantErr) {
            return res.status(200).json({
                error: true,
                message: applicantErr.message
            })
        } else if (applicant) {
            // if applicant already exists with no changes
            if (applicant.firstName === firstName && applicant.middleName === middleName && applicant.lastName === lastName &&
                applicant.email === email && applicant.phone === phone && applicant.address === address && applicant.city === city &&
                applicant.province === province && applicant.postCode === postCode && applicant.country === country && applicant.isEmployee === isEmployee) {

                // create jobApplication with existing applicant
                newApplication = new applicationModel({
                    applicantID: applicant._id,
                    resume: resume,
                    motivationStatement: motivationStatement,
                    jobRef: jobRef
                })
                newApplication.save((newApplicationErr, newApplicationDoc) => {
                    if (newApplicationErr) {
                        return res.status(200).json({
                            error: true,
                            message: newApplicationErr.message
                        })
                    } else {
                        return res.status(200).json({
                            error: false,
                            message: 'Your application has been submitted.',
                            data: newApplicationDoc
                        })
                    }
                })
            } else {

                applicantModel.findOneAndUpdate({ CNIC: CNIC }, {
                    CNIC: CNIC, firstName: firstName, middleName: middleName, lastName: lastName,
                    email: email, phone: phone, address: address, city: city, province: province, postCode: postCode, country: country, __v: __v + 1
                }, { new: true }, (updateAppicantErr, updateApplicantDoc) => {
                    if (updateAppicantErr) {
                        return res.status(200).json({
                            error: true,
                            message: updateAppicantErr.message
                        })
                    } else {
                        // create job application with updated applicant object
                        newApplication = new applicationModel({
                            applicantID: updateApplicantDoc._id,
                            resume: resume,
                            motivationStatement: motivationStatement,
                            jobRef: jobRef
                        })

                        newApplication.save((newApplicationErr, newApplicationDoc) => {
                            if (newApplicationErr) {
                                return res.status(200).json({
                                    error: true,
                                    message: newApplicationErr.message
                                })
                            } else {
                                return res.status(200).json({
                                    error: false,
                                    message: 'Your application has been submitted.',
                                    data: newApplicationDoc
                                })
                            }
                        })
                    }
                })

            }
        }
    })
})

router.post('/shortlistApplication', (req, res) => {

    let { isAdmin, id, name } = verifyToken(req.body.token)

    if (!isAdmin) {
        return res.status(200).json({
            error: true,
            message: 'Access denied. Limited for admin(s).'
        })
    } else {
        let applicationID = req.body.applicationID

        applicantModel.findOneAndUpdate({ _id: applicationID }, { applicationStatus: { status: 'Shortlisted', by: id } }, { new: true }, (err, doc) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                    message: err.message
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Application shorlisted successfully.",
                    data: doc
                })
            }
        })
    }

})

router.post('/rejectApplication', (req, res) => {

    let { isAdmin, id, name } = verifyToken(req.body.token)

    if (!isAdmin) {
        return res.status(200).json({
            error: true,
            message: 'Access denied. Limited for admin(s).'
        })
    } else {
        let applicationID = req.body.applicationID

        applicantModel.findOneAndUpdate({ _id: applicationID }, { applicationStatus: { status: 'Rejected', by: id } }, { new: true }, (err, doc) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                    message: err.message
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Application rejected successfully.",
                    data: doc
                })
            }
        })
    }

})

router.post('/markContacted', (req, res) => {

    let { isAdmin, id, name } = verifyToken(req.body.token)

    if (!isAdmin) {
        return res.status(200).json({
            error: true,
            message: 'Access denied. Limited for admin(s).'
        })
    } else {
        let applicationID = req.body.applicationID

        applicantModel.findOneAndUpdate({ _id: applicationID }, { applicationStatus: { status: 'Contacted', by: id } }, { new: true }, (err, doc) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                    message: err.message
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Applicant marked contacted successfully.",
                    data: doc
                })
            }
        })
    }

})

module.exports = router