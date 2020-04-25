const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subSchema = new Schema({
  str: String,
})

const schema = new Schema({
  str: {type: String},
  s: String,
  num: {type: Number},
  m: Number,
  bool: {type: Boolean},
  b: Boolean,
  ref: {type: Schema.Types.ObjectId, refPath: 'User'},
  arr: [{type: String}],
  obj: {
    a: {type: String},
    b: {type: Number},
  },
  refs: [{type: Schema.Types.ObjectId, refPath: 'User'}],
  sub: subSchema,
})

module.exports = mongoose.model('Simple', schema)