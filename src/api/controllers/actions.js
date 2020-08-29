const logger = require("../../utils/logger")
const persistance = require("../../persistance/s3-storage-interface")

exports.storeImage = async function (req, res, next) {
    try {
        const payload = res.locals
        const data = await persistance.postObject(payload)
        logger.info(data)
        res.send("DONE")
    } catch (err) {
        logger.error(err.stack)
        res.send(err.message)
    }
}

exports.getLastImage = async function (req, res, next) {
    try {
        const keys = await persistance.listLastObjects(1)
        logger.info("Fetching key :" + keys[0])
        const data = await persistance.getObject(keys[0])
        if(data){
            res.send(data.Body)
        } else {
            res.send("No images were found...")
        }
    } catch (err) {
        logger.error(err.stack)
        res.send(err.message)
    }
}

exports.getLastMetadata = async function (req, res, next) {
    try {
        const data = {}
        let aux
        const keys = await persistance.listLastObjects(50)
        for(let i = 0, l = keys.length; i<l; i++){
            logger.info("Fetching key :" + keys[i])
            aux = await persistance.getHeadObject(keys[i])
            data[keys[i]] = aux.Metadata
        }
        res.send(data)
    } catch (err) {
        logger.error(err.stack)
        res.send(err.message)
    }
}

