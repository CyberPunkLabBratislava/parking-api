const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT
});

let s3 = new AWS.S3();

exports.listBuckets = async function () {
    let data = await s3.listBuckets().promise();
    return Promise.resolve(data);
}

exports.postObject = async function (payload) {
    const folder = new Date().toISOString().substr(0, 10);
    let params = {
        Bucket: 'cyberlab-parking',
        Body: payload.data,
        Key: `raw/${folder}/${payload.timestamp}`,
        // Are returned in the HTTP response
        Metadata: {
            mimeType: payload.mimeType,
            // size: payload.size,
            origin: payload.userIP
        }
        // Can be used for lifecycle rules (Not working with scaleway)
        // Tagging: `originIp=${payload.userIP}`
    }
    let data = await s3.putObject(params).promise();
    return Promise.resolve(data);
}
