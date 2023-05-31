const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')
require('dotenv').config()

const {
    AWS_BUCKET_NAME: bucketName,
    AWS_BUCKET_REGION: region,
    ACCESS_KEY_ID: accessKeyId,
    SECRET_ACCESS_KEY: secretAccessKey,
} = process.env

// access S3 with region and account
const s3 = new S3({
    region, accessKeyId, secretAccessKey
})

/**
 * Upload file to s3
 * @param {file} file from req.file(handled by multer)
 * @returns a promise
 */
exports.uploadToS3 = (file) => {
    const stream = fs.createReadStream(file.path)
    const params = {
        Bucket: bucketName,
        Key: file.filename,
        Body: stream
    }
    return s3.upload(params).promise()
}

/**
 * Download file from s3
 * @param {String} key the key in Bucket
 * @returns a readStream
 */
exports.downloadFromS3 = (Key) => {
    const params = { Bucket: bucketName, Key }
    return s3.getObject(params).createReadStream()
}

/**
 * Delete file from s3
 * @param {String} key the key in Bucket
 * @returns a promise
 */
exports.deleteFromS3 = (Key) => {
    const params = { Bucket: bucketName, Key };
    return s3.deleteObject(params).promise()
}