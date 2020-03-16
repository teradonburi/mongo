
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/dbname', {useNewUrlParser: true, useUnifiedTopology: true })

console.log('REPL with async/await and mongoose! 🐍')
const moment = require('moment')
const repl = require('repl')

const replInstance = repl.start({ prompt: '> ' })
replInstance.context.moment = moment

const HISTORY_DIRECTORY = __dirname + '/.ym_history'
// require node version above v11.10.0
replInstance.setupHistory(HISTORY_DIRECTORY, (err) => {
  if (err) console.log(err)
})

const models = require('./models')
for (const name in models) {
  replInstance.context[name] = models[name]
}

replInstance.on('exit', () => {
  mongoose.disconnect()
})

