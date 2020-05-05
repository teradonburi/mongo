const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')
const mongooseLeanMethods = require('mongoose-lean-methods')

const schema = new Schema({
  skill: [{type: String}],
  programmers: [{type: Schema.Types.ObjectId, ref: 'Programmer'}]
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
schema.plugin(mongooseLeanMethods)

schema.method('showSkill', function() {
  console.log(this.skill)
})


module.exports = mongoose.model('ProductManager', schema)