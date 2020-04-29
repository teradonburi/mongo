const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const dbname = 'dbname'
mongoose.connect(`mongodb://localhost/${dbname}`, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
const { User } = require('./models')

app.get('/api/user', async (req, res) => {
  const user = await User.findOne()
  res.json(user)
})

app.listen(3000, () => {
  console.log('Access to http://localhost:3000')
})