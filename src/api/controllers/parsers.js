const logger = require("../../utils/logger")

exports.parseBinaryImage = function (req, res, next) {
    try {
        const img_data = []
        req.on("data", (chunk) => {
            img_data.push(chunk)
        })
        req.on("end", () => {
            res.locals.data = Buffer.concat(img_data)
            next()
        })
    } catch (err) {
        logger.error(err)
        res.send("ERROR")
    }
}