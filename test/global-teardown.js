async function teardown() {
  await global.mongoServer.stop()
}

module.exports = teardown