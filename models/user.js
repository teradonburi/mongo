const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')

const schema = new Schema({
  releation: {type: Schema.Types.ObjectId, ref: 'OtherSchema'},
}, {
  timestamps: true,
})

schema.plugin(mongooseLeanVirtuals)

module.exports = mongoose.model('User', schema)