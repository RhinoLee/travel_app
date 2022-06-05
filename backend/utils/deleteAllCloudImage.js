const storage = require('./config/cloudStorage')
const bucket = storage.bucket('rhinoman-travel-bucket')

const deleteAllCloudImage = ({ userId }) => new Promise(async (resolve, reject) => {
  const folder = process.env.NODE_ENV === "development" ? "test/" : ""
  const prefix = `${folder}user_${userId}/`

  const [files] = await storage.bucket(bucket.name).getFiles({ prefix });

  if (files.length === 0) return resolve(true)

  files.forEach(async (file) => {
    await storage.bucket(bucket.name).file(file.name).delete();
  });
  resolve(true)
})

module.exports = deleteAllCloudImage