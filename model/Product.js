const { count } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
// const mongoosePafinate = require('mongoose-paginate');
const mongoosePafinate = require('mongoose-paginate-v2');
// const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new Schema({
    title: { type: String },
    body: { type: String },
    price: { type: Number },
    exsist: { type: Number },
    inOrder: { type: Number, default: 0 },
    solde: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    size: { type: String },
    promiss: { type: Boolean, default: false },
    images: { type: Object },

    thump: { type: String },
    IMG480: { type: String },
    IMG720: { type: String },
    IMG1080: { type: String },

    slug: { type: String },
    abrishamUsed: { type: String },
    category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
})
productSchema.plugin(timestamps);
productSchema.plugin(mongoosePafinate)



module.exports = mongoose.model('product', productSchema)