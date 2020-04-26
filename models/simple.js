const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subSchema = new Schema({
  str: String,
})

const schema = new Schema({
  str: {type: String},
  s: String, // {type: String}の省略記法、オプションなしの場合のみ可能
  num: {type: Number},
  m: Number, // {type: Number}の省略記法、オプションなしの場合のみ可能
  bool: {type: Boolean},
  b: Boolean, // {type: Boolean}の省略記法、オプションなしの場合のみ可能
  ref: {type: Schema.Types.ObjectId, ref: 'User'},
  arr: [{type: String}],
  obj: {
    a: {type: String},
    b: {type: Number},
  },
  refs: [{type: Schema.Types.ObjectId, ref: 'User'}],
  sub: subSchema,
})

module.exports = mongoose.model('Simple', schema)