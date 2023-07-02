const { count } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePafinate = require('mongoose-paginate-v2');

const UserSchema = new Schema({
        name: { type: String },
        family: { type: String },
        fullName: { type: String },
        userName: { type: String },
        password: { type: String },
        phone: { type: String },
        admin: { type: Boolean },
        masterAdmin: { type: Boolean },
        ban: { type: Boolean },
        seller: { type: Boolean },
        slug: { type: String },
        n_product: { type: Number },
        brand: { type: String },
        logo: { type: String },
        baner: { type: String },
        Slogan: { type: String },
        bankNum: { type: String },
        address: { type: String },
})
UserSchema.plugin(timestamps);
UserSchema.plugin(mongoosePafinate)



module.exports = mongoose.model('User', UserSchema)