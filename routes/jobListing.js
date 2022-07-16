const router = require('express').Router()
const mongoose = require('mongoose')
const jobModel = require('../models/JobListing')

router.post('/getAllJobs', (req, res) => {
    let locations = req.body.locations || ['Karachi', 'Lahore', 'Islamabad']
    let  departments = req.body.departments || ['D1', 'D2', 'D3', 'D4']

    jobModel.find({jobLocation: {$in:locations}, jobDepartment: {$in:departments}}, (err, docs) => {
        if(err){
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
    let locations = req.body.locations || ['Karachi', 'Lahore', 'Islamabad']
    let  departments = req.body.departments || ['D1', 'D2', 'D3', 'D4']

    jobModel.find({jobStatus: 'Active', jobLocation: {$in:locations}, jobDepartment: {$in:departments}}, (err, docs) => {
        if(err){
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
    let locations = req.body.locations || ['Karachi', 'Lahore', 'Islamabad']
    let  departments = req.body.departments || ['D1', 'D2', 'D3', 'D4']

    jobModel.find({jobStatus: 'Closed', jobLocation: {$in:locations}, jobDepartment: {$in:departments}}, (err, docs) => {
        if(err){
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

    let newJob = new jobModel(req.body.jobListing)
    newJob.save((err, doc) => {
        if(err){
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

})

router.post('/editJobListing', (req, res) => {

    let jobID = req.body.jobID
    let {jobTitle, jobDepartment, jobLocation, jobType, reqExperience, jobDescription, jobRequirements, jobIncentives, jobStatus} = req.body.updatedListing

    jobModel.findOne({_id:jobID}, (err,doc) => {
        if(err){
            return res.status(200).json({
                error: true,
                message: err.message
            })
        } else {
            doc.jobTitle=jobTitle
            doc.jobDepartment=jobDepartment
            doc.jobLocation=jobLocation
            doc.jobType=jobType
            doc.reqExperience=reqExperience
            doc.jobDescription=jobDescription
            doc.jobRequirements=jobRequirements
            doc.jobIncentives=jobIncentives
            doc.__v = doc.__v + 1

            doc.save((newErr, newDoc) => {
                if(newErr){
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

})


module.exports = router