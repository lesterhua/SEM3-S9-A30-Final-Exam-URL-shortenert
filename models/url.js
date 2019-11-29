const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema({
  link: {
    type: String,
    required: true
  },
  url: {
    type: String,
    require: true,
    unique: true
  }
})
module.exports = mongoose.model('Url', urlSchema)