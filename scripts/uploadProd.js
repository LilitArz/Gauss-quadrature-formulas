const fs = require('fs')
const Promise = require('bluebird')
const { uploadFileToS3 } = require('./lib/uploadS3.lib.js')
const signale = require('signale')
const path = require('path')

signale.warn('Starting s3 Upload\n')

const rootFolder = path.join(__dirname, '/../dist')
const params = { CacheControl: 'no-cache' }

const files = {
  js: ['landing-1.0.0.min.js']
}

// Read Dist Folder Fonts and SVGs and add to CSS bucket of files object
fs
  .readdirSync(rootFolder)
  .filter(
    file =>
      file.indexOf('.') !== 0 && !file.includes('index') && file !== 'style.css'
  )

const uploader = files =>
  Promise.map(files, file => {
    const destFilePath = 'renderforest/static/bk/js/v1/' + file

    const src = rootFolder + '/' + file
    signale.await(`\n\nUploading local file:\n=> ${src}`)
    console.log(`to: ${destFilePath}`)

    return uploadFileToS3(src, destFilePath, params).then(() =>
      signale.complete(`Finished: ${src}`)
    )
  })

Promise.map(Object.keys(files), type => uploader(files[type]))
  .then(() => signale.success('Successfully finished upload.'))
  .catch(signale.fatal)
