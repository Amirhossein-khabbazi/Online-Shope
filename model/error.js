const { count } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePafinate = require('mongoose-paginate-v2');

const errorSchema = new Schema({
  msg : {type: String},
  part : {type: String},
  section : {type: String},
})
errorSchema.plugin(timestamps);
errorSchema.plugin(mongoosePafinate)



module.exports = mongoose.model('error', errorSchema)