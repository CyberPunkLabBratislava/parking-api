const logger = require("../../utils/logger")

exports.logRequest = function (req, res, next) {
    res.locals.userIP = req.headers["x-forwarded-for"]
    res.locals.size = req.headers["content-length"]
    res.locals.mimeType = req.headers["content-type"]
    res.locals.userAgent = req.headers["user-agent"]
    res.locals.timestamp = new Date().getTime()
    logger.info(res.locals)
    next()
}