const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join('/', './keys.json')

const { Storage } = Cloud
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'celtic-vent-346716',
})

module.exports = storage