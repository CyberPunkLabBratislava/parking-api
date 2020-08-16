const logger = require('../../utils/logger');

exports.parseBinaryImage = function (req, res, next) {
    res.locals.userIP = req.socket.remoteAddress;
    // res.locals.size = req.headers['content-length'];
    res.locals.mimeType = req.headers['content-type'] ? req.headers['content-type'] : "N/A";
    res.locals.timestamp = new Date().getTime();
    console.log(req.headers)
    try {
        let img_data = [];
        req.on('data', function (chunk) {
            img_data.push(chunk)
        });
        req.on('end', function () {
            res.locals.data = Buffer.concat(img_data);
            next();
        });
    } catch (err) {
        logger.error(err);
        res.send('ERROR');
    }
}