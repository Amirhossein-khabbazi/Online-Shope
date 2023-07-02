const { count } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePafinate = require('mongoose-paginate-v2');

const messageSchema = new Schema({
   type : {type : Number}, // 1: to all  , 2:multi  , 3: single
   user : {type : Schema.Types.ObjectId , ref : 'User'},
   body : {type : String},
   admin : {type : Schema.Types.ObjectId , ref : 'User'},
   topic : {type : String}
})
messageSchema.plugin(timestamps);
messageSchema.plugin(mongoosePafinate)



module.exports = mongoose.model('message', messageSchema)