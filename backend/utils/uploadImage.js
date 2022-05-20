const storage = require('./config/cloudStorage')
const bucket = storage.bucket('rhinoman-travel-bucket')

const uploadImage = (file, userId) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file
  const bucketFile = bucket.file(`user_${userId}/${originalname}`);
  const bucketFileStream = bucketFile.createWriteStream({
    resumable: false
  })
  bucketFileStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${bucketFile.name}`
    resolve(publicUrl)
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})

module.exports = uploadImage