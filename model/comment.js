const { count } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePafinate = require('mongoose-paginate-v2');

const commentSchema = new Schema({
   fullName : {type : String},
   phone : {type : Number},
   body : {type : String},
   permission : {type : Boolean},
   child : {type : Schema.Types.ObjectId , ref : 'comment'},
   product : {type : Schema.Types.ObjectId , ref : 'product'},
   father : {type : Boolean}
})
commentSchema.plugin(timestamps);
commentSchema.plugin(mongoosePafinate)



module.exports = mongoose.model('comment', commentSchema)