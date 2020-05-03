const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')
const mongooseLeanDefaults = require('mongoose-lean-defaults')
const mongooseLeanMethods = require('../mongoose-lean-methods')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const secret = 'secret' // 本来はセキュリティのため、環境変数などにして.envやパラメータストア経由から取得する

const reviewSchema = new Schema({
  rating: {type: Number, required: true, min: 1, max: 5},
  comment: String,
}, {
  timestamps: true,
  versionKey: false,
})


reviewSchema.method('showRating', function() {
  console.log(this.rating)
})

const schema = new Schema({
  name: {type: String, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
    select: false,
    validate: { 
      validator: (v) => validator.isEmail(v), 
      message: props => `${props.value}は正しいメールアドレスではありません。`
    },
  },
  phone: {
    type: String,
    select: false,
    validate: { 
      validator: (v) => /\b[0０][0-9０-９]{9,10}\b/.test((v || '').replace(/-|ー/g, '')),
      message: props => `${props.value}は正しい電話番号ではありません。`
    },
  },
  password: {type: String, required: true},
  token: {
    type: String,
    select: false,
    validate: { 
      validator: (v) => validator.isJWT(v),
      message: () => '不正なトークンです。',
    },
    default: function() {
      return jwt.sign(this._id.toString(), secret)
    }
  },
  invitedFrom: {type: Schema.Types.ObjectId, ref: 'User'},
  invites: [{type: Schema.Types.ObjectId, ref: 'User'}],
  reviews: [reviewSchema],
  isAdmin: {type: Boolean, default: false},
  grade: {
    type: String,
    enum: ['normal', 'super', 'ultra'],
    validate: {
      validator: (v, grade) => {
        if (grade.indexOf(grade) <= grade.indexOf(v)) {
          return false
        }
        return true
      },
      message: props => `${props.value}に降格することはありえません。`
    },
  },
  role: {
    type: { type: Schema.Types.ObjectId, refPath: 'role.model' },
    model: { type: String, enum: ['Programmer', 'ProductManager'] },
  },
  isDeleted: {type: Boolean, default: false},
}, {
  versionKey: false,
  timestamps: true,
  toObject: {
    minimize: true,
    virtuals: true,
    transform : function(doc, user) {
      console.log('toObject')
      transform(doc, user)
    },
  },
  toJSON: {
    minimize: true,
    virtuals: true,
    transform: function(doc, user) {
      console.log('toJSON')
      transform(doc, user)
    },
  },
})

function transform(doc, user) {
  delete user.id
  user.password = !!user.password
  if (user.isDeleted) {
    delete user.token
    user.email = !!user.email
    user.phone = !!user.phone
  }

  return user
}

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

const postSave = async function(doc, next) {
  console.log(`updated ${doc._id}`)
  next()
}

schema.post('findOneAndUpdate', postSave)
schema.post('save', postSave)


schema.method('showName', function() {
  console.log(this.name)
})

schema.static('showName', function(doc) {
  console.log(doc.name)
})

// 仮想的なフィールド
schema
  .virtual('image')
  .get(function() {
    const webServer = 'http://localhost' // 保存の場所を変えた場合に差し替えできるようにする
    return `${webServer}/images/${this._id}`
  })

schema.plugin(mongooseLeanVirtuals)
schema.plugin(mongooseLeanDefaults)
schema.plugin(mongooseLeanMethods)

schema.index({ email: 1 }, { unique: true })

module.exports = mongoose.model('User', schema)