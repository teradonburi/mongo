const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')

const schema = new Schema({
  skill: [{type: String}],
  programers: [{type: Schema.Types.ObjectId, refPath: 'Programmer'}]
}, {
  timestamps: true,
  versionKey: false,
})

schema.pre('update', async function(next) {
  this.setOptions({
    runValidators: true,
  })
  return next()
})
schema.pre('findOneAndUpdate', async function(next) {
  this.setOptions({
    runValidators: true,
    new: true,
  })
  return next()
})

schema.plugin(mongooseLeanVirtuals)

module.exports = mongoose.model('ProductManager', schema)