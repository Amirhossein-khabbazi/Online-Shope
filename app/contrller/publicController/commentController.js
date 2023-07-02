const Product = require('./../../../model/Product')
const Category = require('./../../../model/category')
const User = require('./../../../model/User')
const ContactUs = require('./../../../model/contactUs')
const Comment = require('./../../../model/comment')
const Controller = require('./../controller')
const { find } = require('./../../../model/Product')

class commentController extends Controller {

    async create(req, res) {
        if (!req.body || !req.body.fullName || !req.body.phone || !req.body.product) {
            throw new Error('مشکلی از طرف ما رخ داده لطفا صفحه را مجددا بارگزاری کنید ویا از مرورگر دیگری استفاده کنید')
        }
        await Comment.create({
            fullName: req.body.fullName,
            phone: req.body.phone,
            body: req.body.body,
            permission: false,
            product: req.body.product,
            father: true,
            child : null
        })

        // console.log(req.body);

        // res.redirect('/product_details/' + product.slug )
    }

}
module.exports = new commentController;