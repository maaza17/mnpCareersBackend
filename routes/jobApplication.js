const router = require('express').Router()
const mongoose = require('mongoose')
const applicationModel = require('../models/JobApplication')
const applicantModel = require('../models/jobApplicant')
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

    let isEmployee = null;
    if (req.body.isEmployee === undefined || req.body.isEmployee === {}) {
        isEmployee = {
            "isTrue": false,
            "employeeID": null
        }
    }
    let {
        CNIC, firstName, lastName, email, phone, city, resume, motivationStatement, jobRef
    } = req.body
    // console.log(req.body.phone)

    const { errors, isValid } = validateJobApplication({
        CNIC: CNIC, firstName: firstName, lastName: lastName, email: email,
        phone: phone, city: city, resume: resume, motivationStatement: motivationStatement
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
            if (applicant.firstName === firstName && applicant.lastName === lastName &&
                applicant.email === email && applicant.phone === phone && applicant.city === city &&
                applicant.isEmployee === isEmployee) {

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
                    CNIC: CNIC, firstName: firstName, lastName: lastName,
                    email: email, phone: phone, city: city
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
        else {
            let applicantNew = new applicantModel({
                "CNIC": CNIC,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "phone": phone,
                "city": city,
                "isEmployee": isEmployee
            })
            applicantNew.save().then((saved) => {
                newApplication = new applicationModel({
                    applicantID: saved._id,
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
                            application: newApplicationDoc,
                            applicant: saved

                        })
                    }
                })
            }).catch((saveErr) => {
                return res.status(200).json({
                    error: true,
                    message: saveErr.message
                })
            })
        }
    })
})


router.post('/shortlistApplication', (req, res) => {

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

})


router.post('/rejectApplication', (req, res) => {

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
})

router.post('/markContacted', (req, res) => {
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
                        message: "Application marked as contacted successfully.",
                        data: doc
                    })
                }
            })
        }
    })
})

module.exports = router