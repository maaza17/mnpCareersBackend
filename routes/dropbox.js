const router = require('express').Router()
const mongoose = require('mongoose')
const dropboxModel = require('../models/Dropbox')

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

    let dropApp = new dropboxModel(dropbox_app)

    dropApp.save((err, doc) => {
        if(err){
            return res.status(200).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Application recieved successfully.',
                data: doc
            })
        }
    })
})

router.get('/getdropboxapplications', (req, res) => {
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

module.exports = router