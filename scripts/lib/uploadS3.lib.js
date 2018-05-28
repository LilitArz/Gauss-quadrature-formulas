const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const AWS = require('aws-sdk')
const mime = require('mime')

if (!process.env.MEDIA_UPLOADER_AWS_KEY) {
  throw 'No process.env.MEDIA_UPLOADER_AWS_KEY defined'
}
if (!process.env.MEDIA_UPLOADER_AWS_SECRET) {
  throw 'No process.env.MEDIA_UPLOADER_AWS_SECRET defined'
}

AWS.config.update({
  accessKeyId: process.env.MEDIA_UPLOADER_AWS_KEY,
  secretAccessKey: process.env.MEDIA_UPLOADER_AWS_SECRET,
  region: 'us-west-2'
})

const awsBucket = process.env.AWS_BUCKET || 'static.rfstat.com'

function awsMimeType(file) {
  if (file.endsWith('js')) {
    return 'application/x-javascript'
  } else if (file.endsWith('css')) {
    return 'text/css'
  } else {
    return mime.lookup(file)
  }
}

function s3Upload(s3bucket, params) {
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

function s3UploadWithMetadata(s3bucket, params, metadata) {
  return s3Upload(s3bucket, params).then(data => {
    const cParams = Object.assign(
      {
        CopySource: data.Bucket + '/' + data.key,
        Key: data.key,
        MetadataDirective: 'REPLACE'
      },
      metadata
    )

    s3bucket.copyObject(cParams, (err, data) => {
      if (err) return Promise.reject(err)
      return Promise.resolve(data)
    })
  })
}

function uploadFileToS3(srcFilePath, destFilePath, otherParams, Bucket) {
  otherParams = otherParams || {}
  Bucket = Bucket || awsBucket
  return fs.readFileAsync(srcFilePath).then(fileStream => {
    const s3bucket = new AWS.S3({ params: { Bucket: Bucket } })
    const params = {
      Key: destFilePath,
      Body: fileStream,
      ContentType: awsMimeType(srcFilePath)
    }
    Object.keys(otherParams).map(param => {
      params[param] = otherParams[param]
    })
    const metadata = {
      CacheControl: 'public,max-age=-1',
      ContentType: awsMimeType(srcFilePath)
    }
    return s3UploadWithMetadata(s3bucket, params, metadata)
  })
}

module.exports = {
  uploadFileToS3
}
