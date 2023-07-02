const { count } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePafinate = require('mongoose-paginate-v2');

const orderSchema = new Schema({
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    product: { type: Schema.Types.ObjectId, ref: 'product' },
    fullName : {type: String},
    phone : {type: String},
    address : {type: String},
    count :{type: Number},
    price : {type: String}
})
orderSchema.plugin(timestamps);
orderSchema.plugin(mongoosePafinate)



module.exports = mongoose.model('order', orderSchema)