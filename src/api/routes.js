const express = require('express'),
    router = express.Router();

// Controllers
const parsers = require('./controllers/parsers');
const actors = require('./controllers/actions');

module.exports = router
    .get('', function (req, res, next) {
        res.send('Welcome to cyberlab server');
    })
    .post('/image', parsers.parseBinaryImage, actors.storeImage);