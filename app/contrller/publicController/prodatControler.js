const Product = require('./../../../model/Product')
const Category = require('./../../../model/category')
const User = require('./../../../model/User')
const Order = require('./../../../model/order')
const ContactUs = require('./../../../model/contactUs')
const Controller = require('./../controller')
const { find } = require('./../../../model/Product')
const controller = require('./../controller')
const Comment = require('./../../../model/comment')
const Buyer = require('../../../model/buyer')


class prodatController extends Controller {

    async index(req, res) {
        let buyer = await this.getUser(req, res)
        let userInfo = {};
        let userLog = await this.getUser(req, res);
        userInfo = userLog
        //product
        let product = await Product.find({ slug: req.params.slug, promiss: true }).populate('seller')
        let isInCard = false
        product = product[0]
        if (userInfo.buyer && await this.isInCard(req, res, buyer, product))
            isInCard = true
        if(!product){
            res.redirect('/shop')
        }

        //same category
        let sameCate = await this.cateMatch(product.category, await Product.find({ promiss: true }), req)
        sameCate.pop(product.id)
        sameCate = await this.getLeast(req, res, sameCate, 4)

        //category
        let category = await Category.find({})

        //brand
        let user = await User.find({ seller: true })

        //comments
        let page = req.query.page || 1
        let comment = await Comment.find({ permission: true, product: product.id }).populate('child').sort({ createdAt: -1 })
        //______________________________________________________________________________________________________________
        //get card
        let use = await this.getUser(req, res)
        let card = await this.Qcard(req , res)



        return res.render('product-details', { card, req, pro: product, category, user, sameCate, comment, userInfo, isInCard })
    }

    async like(req, res) {
        let product = await Product.find({ slug: req.params.slug })
        //throw error

        product = product[0]
        let like = product.like
        await Product.updateOne(
            { _id: product.id },
            { like: like + 1 }
        )
    }

    async disLike(req, res) {
        let product = await Product.find({ slug: req.params.slug })
        //throw error


        product = product[0]
        let like = product.like
        await Product.updateOne(
            { _id: product.id },
            { like: like - 1 }
        )
    }

    async getOrder(req, res) {
        let error = {}
        let product = await Product.find({ slug: req.params.slug })
        if (!product) {
            return res.redirect('/shop')
        }
        //throw error
        if (!req.body) {
            error.err = true
            error.msg = "مشکلی از طرف شما رخ داده لطفا سایت را مجددا بارگزاری کنید یا از مرورگر دیگری استفاده کنید"
            res.send(error)
            throw new Error('مشکلی از طرف شما رخ داده لطفا سایت را مجددا بارگزاری کنید یا از مرورگر دیگری استفاده کنید')
        }
        if (!req.body.name || !req.body.phone || !req.body.body || !req.body.address || !req.body.number || !req.body.userId) {
            error.err = true
            error.msg = "مشکلی از طرف شما رخ داده لطفا سایت را مجددا بارگزاری کنید یا از مرورگر دیگری استفاده کنید"
            res.send(error)
            throw new Error('مشکلی از طرف شما رخ داده لطفا سایت را مجددا بارگزاری کنید یا از مرورگر دیگری استفاده کنید')
        }
        product = product[0]
        if (product.exsist < parseInt(req.body.number)) {
            error.err = true
            error.msg = "مشكلي رخ داده: تعداد سفارشات شما از تعداد کالاهای موجود در انبار بیشتر است"
            res.send(error)
            throw new Error('مشكلي رخ داده: تعداد سفارشات شما از تعداد کالاهای موجود در انبار بیشتر است')
        }

        //check if is not change the code
        let user = await this.getUser(req, res);
        if (!user || user.id != req.body.userId) {
            // throw new Error('مشكلي رخ داده:لطفا سایترا دوباره بارگزاری کنید یا از مرورگر دیگری استفاده کنید')
            error.err = true
            error.log = true
            error.msg = "اعتبار نشست شما به پایان رسیده لطفا مجددا وارد سایت بشوید"
            return res.send(error)
        }


        //check paymebt****************************************************************************************
        //if(paymebt)

        await Product.updateOne(
            { _id: product.id },
            { solde: product.solde + parseInt(req.body.number) }
        )

        await Product.updateOne(
            { _id: product.id },
            { inOrder: product.inOrder + parseInt(req.body.number) }
        )
        await Product.updateOne(
            { _id: product.id },
            { exsist: product.exsist - parseInt(req.body.number) }
        )
        Order.create({
            seller: product.seller,
            user: user.id,
            product: product.id,
            fullName: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            number: parseInt(req.body.number),
            body: req.body.body
        })
        error.err = false
        if (user.buyer) {
            await Buyer.update(
                { _id: user.id },
                { "$pull": { "card": product.id } }
            )
        }
        return res.send(error)
    }

}
module.exports = new prodatController