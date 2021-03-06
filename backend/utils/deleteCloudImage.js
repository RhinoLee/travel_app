const storage = require('./config/cloudStorage')
const bucket = storage.bucket('rhinoman-travel-bucket')

const deleteCloudImage = ({ userId, fileLink, category }) => new Promise(async (resolve, reject) => {
  const arr = fileLink.split("/")
  const imageName = arr[arr.length - 1]
  const folder = process.env.NODE_ENV === "development" ? "test/" : ""
  const dbAvatarName = `${folder}user_${userId}/${category}/${imageName}`

  const [files] = await storage.bucket(bucket.name).getFiles();

  files.forEach(async (file) => {
    if (file.name === dbAvatarName) {
      console.log("find storage file & delete");
      await storage.bucket(bucket.name).file(file.name).delete();
    }
  });
  resolve(true)
})

module.exports = deleteCloudImage