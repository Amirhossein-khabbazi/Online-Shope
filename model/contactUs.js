const { count } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePafinate = require('mongoose-paginate-v2');

const contactUsSchema = new Schema({
   fullName : {type : String},
   phone : {type : Number},
   body : {type : String},
   subject : {type : String},
   req : {type : Boolean},
   userType : {type : Number}, // 1 : is logined user , 2 : is seller , 3 : is normal user
   user : {type : Schema.Types.ObjectId , ref : 'User'}
})
contactUsSchema.plugin(timestamps);
contactUsSchema.plugin(mongoosePafinate)



module.exports = mongoose.model('contactUs', contactUsSchema)