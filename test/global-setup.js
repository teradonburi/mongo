const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoServer = new MongoMemoryServer()

async function setup() {
  const mongoUri = await mongoServer.getUri()
  process.env.mongoUri = mongoUri
  global.mongoServer = mongoServer
}

module.exports = setup
