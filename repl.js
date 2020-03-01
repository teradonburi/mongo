const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')

const schema = new Schema({
  releation: {type: Schema.Types.ObjectId, ref: 'OtherSchema'},
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, m) => {
      delete m.__v
      return m
    },
  },
})

schema.plugin(mongooseLeanVirtuals)

module.exports = mongoose.model('SchemaName', schema)