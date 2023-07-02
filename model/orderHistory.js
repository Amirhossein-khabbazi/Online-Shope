const { count } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePafinate = require('mongoose-paginate-v2');

const orderHistorySchema = new Schema({
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    buyer: { type: Schema.Types.ObjectId, ref: 'Buyer' },
    product: { type: Schema.Types.ObjectId, ref: 'product' },
    order: { type: Schema.Types.ObjectId, ref: 'order' },
    sent : {type:Boolean},
    pay : {type:Boolean},/// from here
    count : {type: String},
    price : {type: String},
    code : {type : String},
    title : {type : String},
    address : {type : String},
    status : {type : Boolean},
})
orderHistorySchema.plugin(timestamps);
orderHistorySchema.plugin(mongoosePafinate)



module.exports = mongoose.model('orderHistory', orderHistorySchema)