const router = require('express').Router()
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const dropboxModel = require('../models/Dropbox')

const dropboxValidation = require('../validation/dropboxValidation')

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

router.post('/applyviadropbox', (req, res) => {
    let dropbox_app = req.body.dropbox_app

    const {errors, isValid} = dropboxValidation(dropbox_app)

    if(!isValid){
        return res.status(200).json({
            error: true,
            message: 'Check error messages!',
            error_messages: errors
        })
    } else {
        let dropApp = new dropboxModel(dropbox_app)

        dropApp.save((err, doc) => {
            if(err){
                if(err.code == 11000){
                    return res.status(200).json({
                        error: true,
                        message: 'You have already submitted your details with us. We shall get in touch if we find the right role for you.'
                    })
                } else {
                    return res.status(200).json({
                        error: true,
                        message: 'An unexpected error occured. Please try again later.'
                    })
                }
            } else {
                return res.status(200).json({
                    error: false,
                    message: 'Application recieved successfully.',
                    data: doc
                })
            }
        })
    }
})

router.post('/getdropboxapplications', (req, res) => {
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
            dropboxModel.find({}, (err, docs) => {
                if(err){
                    return res.status(200).json({
                        error: true,
                        message: err.message
                    })
                } else {
                    return res.status(200).json({
                        error: false,
                        message: 'Found ' + docs.length + ' applications from dropbox.',
                        data: docs
                    })
                }
            })
        }
    })
})

router.post('/getdropboxapplicationbyid', (req, res) => {
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

            dropboxModel.findOne({_id: applicationID}, (err, doc) => {
                if(err){
                    return res.status(200).json({
                        error: true,
                        message: 'An unexpected error occured. Please try again later.'
                    })
                } else {
                    if(doc.status == 'New'){
                        doc.status = 'Reviewed'
                        doc.save((saveErr, saveDoc) => {
                            if(saveErr){
                                return res.status(200).json({
                                    error: true,
                                    message: 'Access denied. Limited for admin(s).'
                                })
                            } else {
                                return res.status(200).json({
                                    error: false,
                                    message: 'Dropbox application found.',
                                    data: saveDoc
                                })
                            }
                        })
                    } else {
                        return res.status(200).json({
                            error: false,
                            message: 'Dropbox application found.',
                            data: doc
                        })
                    }
                }
            })
        }
    })
})

router.post('/markdropboxapplicationcontacted', (req, res) => {
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

            dropboxModel.findOne({_id: applicationID}, (err, doc) => {
                if(err){
                    return res.status(200).json({
                        error: true,
                        message: 'An unexpected error occured. Please try again later.'
                    })
                } else {
                    if(doc.status == 'Contacted'){
                        return res.status(200).json({
                            error: false,
                            message: 'Application already marked as contacted.',
                            data: doc
                        })
                    } else{
                        doc.status = 'Contacted'
                        doc.save((saveErr, saveDoc) => {
                            if(saveErr){
                                return res.status(200).json({
                                    error: true,
                                    message: 'An unexpected error occured. Please try again later.'
                                })
                            } else {
                                return res.status(200).json({
                                    error: false,
                                    message: 'Application marked contacted successfully.',
                                    data: saveDoc
                                })
                            }
                        })
                    }
                }
            })
        }
    })
})

router.post('/rejectdropboxapplication', (req, res) => {
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

            dropboxModel.findOne({_id: applicationID}, (err, doc) => {
                if(err){
                    return res.status(200).json({
                        error: true,
                        message: 'An unexpected error occured. Please try again later.'
                    })
                } else {
                    if(doc.status == 'Rejected'){
                        return res.status(200).json({
                            error: false,
                            message: 'Application already marked as rejected.',
                            data: doc
                        })
                    } else{
                        doc.status = 'Rejected'
                        doc.save((saveErr, saveDoc) => {
                            if(saveErr){
                                return res.status(200).json({
                                    error: true,
                                    message: 'An unexpected error occured. Please try again later.'
                                })
                            } else {
                                return res.status(200).json({
                                    error: false,
                                    message: 'Application rejected successfully.',
                                    data: saveDoc
                                })
                            }
                        })
                    }
                }
            })
        }
    })
})

module.exports = router