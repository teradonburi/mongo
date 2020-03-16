const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')
const validator = require('validator')

const grade = ['normal', 'super', 'ultra']

const reviewSchema = new Schema({
  rating: {type: Number, required: true, min: 1, max: 5},
  comment: String,
}, {
  timestamps: true,
  versionKey: false,
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
    unique: true,
    select: false,
    validate: { 
      validator: (v) => /\b[0０][0-9０-９]{9,10}\b/.test((word || '').replace(/-|ー/g, '')),
      message: props => `${props.value}は正しい電話番号ではありません。`
    },
  },
  password: {type: String, transform: (v) => {}},
  token: {
    type: String,
    required: true,
    select: false,
    validate: { 
      validator: (v) => validator.isJWT(v),
      message: () => '不正なトークンです。',
    },
  },
  invitedFrom: {type: Schema.Types.ObjectId, refPath: 'User'},
  invites: [{type: Schema.Types.ObjectId, refPath: 'User'}],
  reviews: [reviewSchema],
  isAdmin: {type: Boolean, default: false},
  grade: {
    type: String,
    enum: grade,
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
    model: { type: String, enum: ['Programmer', 'ProductManager', 'ProductOwener'] },
    type: { type: Schema.Types.ObjectId, refPath: 'role.model' },
  },
  isDeleted: {type: Boolean, default: false},
}, {
  versionKey: false,
  timestamps: true,
  toObject: {
    minimize: true,
    virtuals: true,
    transform,
  },
  toJSON: {
    minimize: true,
    virtuals: true,
    transform,
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

schema
  .virtual('image')
  .get(function() {
    return `${webServer}/images/${this._id}`
  })

schema.plugin(mongooseLeanVirtuals)

schema.index({ email: 1 }, { unique: true })

module.exports = mongoose.model('User', schema)