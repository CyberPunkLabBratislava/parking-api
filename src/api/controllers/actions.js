const logger = require('../../utils/logger');
const persistance = require('../services/s3-storage-interface');

exports.storeImage = async function (req, res, next) {
    try {
        let payload = res.locals;
        let data = await persistance.postObject(payload);
        logger.info(data);
        res.send('DONE');
    } catch (err) {
        logger.error(err);
        res.send('ERROR');
    }
}