const AWS = require("aws-sdk")

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT
})

const s3 = new AWS.S3()

const listBuckets = async function () {
    const data = await s3.listBuckets().promise()
    return Promise.resolve(data)
}

const postObject = async function (payload) {
    const folder = new Date().toISOString().substr(0, 10)
    const params = {
        Bucket: "cyberlab-parking",
        Body: payload.data,
        Key: `raw/${folder}/${payload.timestamp}.png`,
        // Are returned in the HTTP response
        Metadata: {
            mimeType: payload.mimeType || "NA",
            size: payload.size || "NA",
            origin: payload.userIP || "NA",
            agent: payload.userAgent || "NA"
        }
        // Can be used for lifecycle rules (Not working with scaleway)
        // Tagging: `originIp=${payload.userIP}`
    }
    const data = await s3.putObject(params).promise()
    return data
}

const getObject = async function (key) {
    const params = {
        Bucket: "cyberlab-parking", /* required */
        Key: key, /* required */
        ResponseContentType: "image/png"
    }
    const data = await s3.getObject(params).promise()
    return data
}

const getHeadObject = async function (key) {
    const params = {
        Bucket: "cyberlab-parking", /* required */
        Key: key /* required */
    }
    const data = await s3.headObject(params).promise()
    return data
}

const listObjects = async function () {
    const params = {
        Bucket: "cyberlab-parking", /* required */
        // Delimiter: "STRING_VALUE",
        // ContinuationToken: "STRING_VALUE",
        FetchOwner: false,
        // MaxKeys: 5,
        Prefix: "raw/",
        // StartAfter: 'STRING_VALUE'
        // RequestPayer: requester
    }
    const data = await s3.listObjectsV2(params).promise()
    return data
}

const listLastObjects = async function (num_keys) {
    const params = {
        Bucket: "cyberlab-parking", /* required */
        FetchOwner: false
    }
    let keys = []
    let finish = false
    let n = 0
    let data
    while (finish === false && n <= 30) {
        const d = new Date()
        d.setDate(d.getDate() - n)
        const folder = d.toISOString().substr(0, 10)
        params.Prefix = `raw/${folder}`
        data = await s3.listObjectsV2(params).promise()
        data.Contents.forEach((elem) => {
            keys = keys.concat(elem.Key)
        })
        if (keys.length > 0 && !data.IsTruncated) {
            finish = true
            const l = keys.length
            data = keys.slice(Math.max(l - num_keys, 0))
        } else {
            params.ContinuationToken = data.NextContinuationToken
        }
        n += 1
    }
    return data
}

module.exports = {
    listBuckets,
    postObject,
    listObjects,
    listLastObjects,
    getObject,
    getHeadObject
}