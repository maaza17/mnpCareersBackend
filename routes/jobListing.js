const router = require('express').Router()
const mongoose = require('mongoose')
const jobModel = require('../models/JobListing')

router.get('/getAllJobs', (req, res) => {

    jobModel.find({}, (err, docs) => {
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

module.exports = router