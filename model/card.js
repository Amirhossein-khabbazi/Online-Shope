const { count } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePafinate = require('mongoose-paginate-v2');

const card = new Schema({
        pro : {type: Schema.Types.ObjectId, ref: 'product'},
        count : {type : String},
        buyer : { type: Schema.Types.ObjectId, ref: 'Buyer' }
})
card.plugin(timestamps);
card.plugin(mongoosePafinate)



module.exports = mongoose.model('Card', card)