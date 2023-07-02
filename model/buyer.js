const { count } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePafinate = require('mongoose-paginate-v2');

const BuyerSchema = new Schema({
        name: { type: String },
        family: { type: String },
        fullName: { type: String },
        userName: { type: String },
        password: { type: String },
        phone: { type: String , unique : true },
        address: { type: String },
        buyer: { type: Boolean },
        card: [{ pro : {type: Schema.Types.ObjectId, ref: 'product'} , count: {type : Number}}],
        favorite: [{ type: Schema.Types.ObjectId, ref: 'product' }],
})
BuyerSchema.plugin(timestamps);
BuyerSchema.plugin(mongoosePafinate)



module.exports = mongoose.model('Buyer', BuyerSchema)