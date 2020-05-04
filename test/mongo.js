const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connection.on('error', (e) => {
  if (e.message.code === 'ETIMEDOUT') {
    console.log(e);
    mongoose.connect(mongoUri, mongooseOpts)
  }
  console.log(e)
})

const mongooseOpts = {
  useCreateIndex: true, 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false,
}

const mongoUri = process.env.mongoUri
mongoose.connect(mongoUri, mongooseOpts)
module.exports = mongoose