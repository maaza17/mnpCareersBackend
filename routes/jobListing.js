const router = require('express').Router()
const mongoose = require('mongoose')
const jobModel = require('../models/JobListing')
const applicationModel = require('../models/JobApplication')
const applicantModel = require('../models/jobApplicant')

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

router.post('/getAllJobs', (req, res) => {
    jobModel.find({}, (err, docs) => {
        if (err) {
            return res.status(200).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'All job listings found',
                data: docs
            })
        }
    })

})


router.post('/getActiveJobs', (req, res) => {
    jobModel.find({ jobStatus: 'Active' }, (err, docs) => {
        if (err) {
            return res.status(200).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'All active job listings found',
                data: docs
            })
        }
    })

})


router.post('/getClosedJobs', (req, res) => {
    jobModel.find({ jobStatus: 'Closed' }, (err, docs) => {
        if (err) {
            return res.status(200).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'All closed job listings found',
                data: docs
            })
        }
    })

})

router.post('/addNewJob', (req, res) => {

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
            let newJobListing = req.body.jobListing
            newJobListing.createdBy = {
                adminID: id,
                adminName: name
            }
            let newJob = new jobModel(newJobListing)
            newJob.save((err, doc) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        message: err.message
                    })
                } else {
                    return res.status(200).json({
                        error: false,
                        message: 'Job listed successfully',
                        data: doc
                    })
                }
            })
        }
    })
}) 

router.post('/editJobListing', (req, res) => {

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
            if (
                jobTitle === null || jobTitle === undefined ||
                jobDepartment === null || jobDepartment === undefined ||
                jobCity === null || jobCity === undefined ||
                jobType === null || jobType === undefined ||
                reqExperience === null || reqExperience === undefined ||
                jobDescription === null || jobDescription === undefined ||
                jobRequirements === null || jobRequirements === undefined ||
                jobIncentives === null || jobIncentives === undefined ||
                jobSalary === null || jobSalary === undefined ||
                jobStatus === null || jobStatus === undefined ||
                forEmployees === null || forEmployees === undefined ||
                dateCreated === null || dateCreated === undefined ||
                createdBy === null || createdBy === undefined) {
                return res.status(200).json({
                    error: true,
                    message: "Null values found. Please send all the required data."
                })
            }
            let jobID = req.body.jobID
            let { jobTitle, jobDepartment, jobCity, jobType, reqExperience, jobDescription, jobRequirements, jobIncentives, jobSalary, jobStatus, forEmployees, dateCreated, createdBy } = req.body.updatedListing

            jobModel.findOne({ _id: jobID }, (err, doc) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        message: err.message
                    })
                } else {
                    doc.jobTitle = jobTitle;
                    doc.jobDepartment = jobDepartment;
                    doc.jobCity = jobCity;
                    doc.jobType = jobType;
                    doc.reqExperience = reqExperience;
                    doc.jobDescription = jobDescription;
                    doc.jobRequirements = jobRequirements;
                    doc.jobIncentives = jobIncentives;
                    doc.jobSalary = jobSalary;
                    doc.jobStatus = jobStatus;
                    doc.forEmployees = forEmployees;
                    doc.dateCreated = dateCreated;
                    doc.createdBy = createdBy;
                    doc.save((newErr, newDoc) => {
                        if (newErr) {
                            return res.status(200).json({
                                error: true,
                                message: err.message
                            })
                        } else {
                            return res.status(200).json({
                                error: false,
                                message: 'Job listed successfully',
                                data: newDoc
                            })
                        }
                    })
                }
            })
        }
    })
})

router.post('/openJob', (req, res) => {
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
            let jobID = req.body.jobID
            jobModel.findOne({ _id: jobID }, (err, doc) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        message: err.message
                    })
                } else {
                    console.log(doc)
                    if (doc.jobStatus === "Active") {
                        return res.status(200).json({
                            error: false,
                            message: "This job is already Activated"
                        })
                    }
                    else {
                        doc.jobStatus = "Active";
                        doc.save((newErr, newDoc) => {
                            if (newErr) {
                                return res.status(200).json({
                                    error: true,
                                    message: newErr.message
                                })
                            } else {
                                return res.status(200).json({
                                    error: false,
                                    message: 'Job Activated successfully',
                                    data: newDoc
                                })
                            }
                        })
                    }
                }
            })
        }
    })
})

router.post('/closeJob', (req, res) => {
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
            let jobID = req.body.jobID
            jobModel.findOne({ _id: jobID }, (err, doc) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        message: err.message
                    })
                } else {
                    console.log(doc)
                    if (doc.jobStatus === "Closed") {
                        return res.status(200).json({
                            error: false,
                            message: "This job is already Closed"
                        })
                    }
                    else {
                        doc.jobStatus = "Closed";
                        doc.save((newErr, newDoc) => {
                            if (newErr) {
                                return res.status(200).json({
                                    error: true,
                                    message: newErr.message
                                })
                            } else {
                                return res.status(200).json({
                                    error: false,
                                    message: 'Job Closed successfully',
                                    data: newDoc
                                })
                            }
                        })
                    }
                }
            })
        }
    })
})

// router.post('/haris', (req, res) => {
//     applicantModel.find({}).remove((err, docs) => {
//         jobModel.find({}).remove((err, docs) => {
//             applicationModel.find({}).remove((err, docs) => {
//                 return res.status(200).json({
//                     error: false,
//                     docs: docs,
//                     message: 'Done!'
//                 })
//             });
//         });
//     });
// })


router.post('/getApplicationsByJob', (req, res) => {
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
            let jobID = req.body.jobID
            applicationModel.find({ jobRef: jobID }, (err, docs) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        message: err.message
                    })
                } else if (docs.length === 0) {
                    return res.status(200).json({
                        error: false,
                        message: 'No applications received yet.',
                        data: []
                    })
                } else if (docs.length > 0) {
                    docs.forEach(doc => {
                        applicantModel.findOne({ _id: doc.applicantID }, (appErr, appDoc) => {
                            if (appErr) {
                                return res.status(200).json({
                                    error: true,
                                    message: appErr.message
                                })
                            } else { doc.applicantObj = appDoc }
                        })
                    })
                    return res.status(200).json({
                        error: false,
                        message: "Applications for job opening found.",
                        data: docs
                    })
                } else {
                    return res.status(200).json({
                        error: false,
                        message: 'No data found. Please try again',
                    })
                }
            })
        }
    })
})



router.post('/getManyApplicants', (req, res) => {
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
            let applicantIDs = req.body.applicantIDs
            applicantModel.find({ _id: { $in: applicantIDs } }, (err, docs) => {
                console.log(docs)
                if (err) {
                    return res.status(200).json({
                        error: true,
                        message: err.message
                    })
                } else if (docs.length === 0) {
                    return res.status(200).json({
                        error: false,
                        message: 'No applicants found.',
                        data: []
                    })
                } else if (docs.length > 0) {
                    return res.status(200).json({
                        error: false,
                        message: 'Here you go good sir.',
                        data: docs
                    })
                } else {
                    return res.status(200).json({
                        error: true,
                        message: 'An unexpected error occured. Please try again',
                    })
                }
            })
        }
    })
})


module.exports = router