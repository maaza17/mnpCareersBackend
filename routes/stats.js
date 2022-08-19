const router = require('express').Router()
const mongoose = require('mongoose')
const applicationModel = require('../models/JobApplication')
const applicantModel = require('../models/jobApplicant')
const dropboxModel = require('../models/Dropbox')
const jobModel = require('../models/JobListing')
const employeeModel = require('../models/Employee')
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

router.post('/getstats', (req, res) => {

    // No. of Total job apps
    var numTotalJobApps = null
    // No. of New job apps
    var numNewJobApps = null
    // No. of Contacted job apps
    var numContactedJobApps = null
    // No. of Rejected job apps
    var numRejectedJobApps = null
    // No. of Shortlisted job apps
    var numShortJobApps = null
    // No. of Hired job apps
    var numHiredJobApps = null

    // No. of Total Dropbox apps
    var numTotalDropboxApps = null
    // No. of New Dropbox apps
    var numNewDropboxApps = null
    // No. of Contacted Dropbox apps
    var numContactedDropboxApps = null
    // No. of Rejected Dropbox apps
    var numRejectedDropboxApps = null
    // No. of Hired Dropbox apps
    var numHiredDropboxApps = null

    // No. of Open jobs
    var numOpenJobs=null

    // No. of Employees
    var numEmployees = null

    // No of Unique Applicants
    var numApplicants = null

    // No of Unique Applicants who are employees
    var numEmpApplicants = null

    // Application Timeline - array
    var appArray = null

    // Dropbox Application Timeline - array
    var dropboxAppArray = null

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
            
            // application stats
            applicationModel.find({}, {_id: true, applicationStatus: true, dateApplied: true}, (applicationsErr, applicationsDocs) => {
                if(applicationsErr){
                    return res.status(200).json({
                        error: true,
                        message: 'An unexpected error occured while retrieving application stats. Please try again later.'
                    })
                } else{
                    appArray = applicationsDocs
                    // No. of Total job apps
                    numTotalJobApps = appArray.length
                    // No. of New job apps
                    numNewJobApps = appArray.filter(app => app.applicationStatus.status === 'New').length
                    // No. of Contacted job apps
                    numContactedJobApps = appArray.filter(app => app.applicationStatus.status === 'Contacted').length
                    // No. of Rejected job apps
                    numRejectedJobApps = appArray.filter(app => app.applicationStatus.status === 'Rejected').length
                    // No. of Shortlisted job apps
                    numShortJobApps = appArray.filter(app => app.applicationStatus.status === 'Shortlisted').length
                    // No. of Hired job apps
                    numHiredJobApps = appArray.filter(app => app.applicationStatus.status === 'Hired').length

                    // dropbox stats
                    dropboxModel.find({}, {_id: true, status: true, dateCreated: true}, (dropErr, dropDocs) => {
                        if(dropErr){
                            return res.status(200).json({
                                error: true,
                                message: 'An unexpected error occured while retrieving dropbox stats. Please try again later.'
                            })
                        } else{
                            dropboxAppArray = dropDocs
                            // No. of Total Dropbox apps
                            numTotalDropboxApps = dropboxAppArray.length
                            // No. of New Dropbox apps
                            numNewDropboxApps = dropboxAppArray.filter(app => app.status === 'New').length
                            // No. of Contacted Dropbox apps
                            numContactedDropboxApps = dropboxAppArray.filter(app => app.status === 'Contacted').length
                            // No. of Rejected Dropbox apps
                            numRejectedDropboxApps = dropboxAppArray.filter(app => app.status === 'Rejected').length
                            // No. of Hired Dropbox apps
                            numHiredDropboxApps = dropboxAppArray.filter(app => app.status === 'Hired').length

                            // Job Listing Stats
                            jobModel.find({jobStatus: 'Open'}, {_id: true}, (jobErr, jobDocs) => {
                                if(jobErr){
                                    return res.status(200).json({
                                        error: true,
                                        message: 'An unexpected error occured while retrieving job stats. Please try again later.'
                                    })
                                } else{
                                    numOpenJobs = jobDocs.length

                                    // Employee stats
                                    employeeModel.find({}, {_id: true}, (empErr, empDocs) => {
                                        if(empErr){
                                            return res.status(200).json({
                                                error: true,
                                                message: 'An unexpected error occured while retrieving employee stats. Please try again later.'
                                            })
                                        } else{
                                            numEmployees = empDocs.length

                                            // Applicant stats
                                            applicantModel.find({}, {_id: true, isEmployee: true}, (applicantErr, applicantDocs) => {
                                                if(applicantErr){
                                                    return res.status(200).json({
                                                        error: true,
                                                        message: 'An unexpected error occured while retrieving applicant stats. Please try again later.'
                                                    })
                                                } else{
                                                    numApplicants = applicantDocs.length
                                                    numEmpApplicants = applicantDocs.filter(app => app.isEmployee.isTrue === true).length


                                                    // return all stats
                                                    return res.status(200).json({
                                                        error: false,
                                                        message: 'Find all required stats in data object.',
                                                        data: {
                                                            numTotalJobApps: numTotalJobApps,
                                                            numNewJobApps: numNewJobApps,
                                                            numContactedJobApps: numContactedJobApps,
                                                            numRejectedJobApps: numRejectedJobApps,
                                                            numShortJobApps: numShortJobApps,
                                                            numHiredJobApps: numHiredJobApps,

                                                            numTotalDropboxApps: numTotalDropboxApps,
                                                            numNewDropboxApps: numNewDropboxApps,
                                                            numContactedDropboxApps: numContactedDropboxApps,
                                                            numRejectedDropboxApps: numRejectedDropboxApps,
                                                            numHiredDropboxApps: numHiredDropboxApps,

                                                            numOpenJobs: numOpenJobs,

                                                            numEmployees: numEmployees,

                                                            numApplicants: numApplicants,
                                                            numEmpApplicants: numEmpApplicants,

                                                            appArray: appArray,
                                                            
                                                            dropboxAppArray: dropboxAppArray,

                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })

})



module.exports = router