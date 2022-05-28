const storage = require('./config/cloudStorage')
const bucket = storage.bucket('rhinoman-travel-bucket')

const uploadCloudImage = (file, userId, category) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file
  const folder = process.env.NODE_ENV === "development" ? "test/" : "" 
  console.log("folder", folder)
  const bucketFile = bucket.file(`${folder}user_${userId}/${category}/${originalname}`);
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

module.exports = uploadCloudImage