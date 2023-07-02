const Controller = require('../controller')
const User = require('./../../../model/User')
const Buyer = require('./../../../model/buyer')
const Card = require('./../../../model/card')
const OrderHistory = require('./../../../model/orderHistory')
const Product = require('./../../../model/Product')
const ContactUs = require('./../../../model/contactUs')
const Message = require('./../../../model/message')
const Category = require('./../../../model/category')
const Order = require('./../../../model/order')
const Comment = require('./../../../model/comment')
const { validationResult } = require('express-validator');
const { all } = require('../../router')
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const swal = require('sweetalert')
const { nextTick } = require('process')
const request = require('request');
let ss = ''

class buyerController extends Controller {
    async index(req, res) {
        try {
            let user = await this.getUser(req, res)

            //user orders
            let buyer = await Buyer.findById(user.id).populate('card.pro')

            let order = await Order.find({ user: user.id }).populate('product').sort({ createdAt: -1 })

            let history = await OrderHistory.find({ buyer: user.id }).populate('product').sort({ createdAt: -1 })


            let card = await this.Qcard(req, res)

            //------------------------------------------------------------------------------------------

            res.render('buyer/buyer', { req, user, history, order, buyer, suc: req.flash('success'), err: req.flash("error"), Delete: req.flash("removeFromCard"), error: req.flash("buyerError"), card })


        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }
        //user Info

    }

    async sineIn(req, res) {
        try {
            let phoneUniq = true
            let phonecrect = true
            let old = {}
            let error;

            let query;
            old = req.query

            if (!req.query.button) {
                req.flash('formData', old)
                return res.render('buyer/login.ejs', { error, oldData: req.flash('formData') || [] })
            }
            else {
                if (!req.query.name) {
                    req.flash('formData', old)
                    error = "نام نمیتواند خالی بماند"
                    return res.render('buyer/login.ejs', { error, oldData: req.flash('formData') || [] })
                }
                else if (!req.query.family) {
                    req.flash('formData', old)
                    error = "نام خانوادگی نمیتواند خالی بماند"
                    return res.render('buyer/login.ejs', { error, oldData: req.flash('formData') || [] })
                }
                else if (!req.query.phone) {
                    req.flash('formData', old)
                    error = "شماره تلفن نمیتواند خالی بماند"
                    return res.render('buyer/login.ejs', { error, oldData: req.flash('formData') || [] })
                }
                else if (req.query.phone.length != 11) {
                    phonecrect = false
                    req.flash('formData', old)
                    error = "لطفا شماره موبایل خود را صحیح وارد کنید"
                    return res.render('buyer/login.ejs', { error, oldData: req.flash('formData') || [] })
                }

                else if (!req.query.password) {
                    req.flash('formData', old)
                    error = "رمز عبور نمیتواند خالی بماند"
                    return res.render('buyer/login.ejs', { error, oldData: req.flash('formData') || [] })
                }
                else if (req.query.password.length < 8) {
                    req.flash('formData', old)
                    error = "پسورد نمیتواند کمتر از 8 کاراکتر باشد"
                    return res.render('buyer/login.ejs', { error, oldData: req.flash('formData') || [] })
                }
                else if (!req.query.address) {
                    req.flash('formData', old)
                    error = "آدرس نمیتواند خالی بماند"
                    return res.render('buyer/login.ejs', { error, oldData: req.flash('formData') || [] })
                }
                //----------------------------
                else if (req.query.phone) {
                    let buyer = await Buyer.find({})

                    await buyer.forEach(phone => {
                        if (phone.phone == req.query.phone) {
                            phoneUniq = false
                            req.flash('formData', old)
                            error = "همچین شماره موبایلی از قبل ثبت شده است"
                            return res.render('buyer/login.ejs', { error, oldData: req.flash('formData') || [] })
                        }
                    })
                }
                //-----------------------
            }
            if (req.query.name && req.query.family && req.query.phone && phoneUniq == true && phonecrect == true && req.query.password && req.query.button) {
                // console.log('ok buyer');
                let user = await Buyer.create({
                    name: req.query.name,
                    family: req.query.family,
                    fullName: req.query.name + ' ' + req.query.family,
                    phone: req.query.phone,
                    password: req.query.password,
                    userName: req.query.phone,
                    address: req.query.address,
                    buyer: true,
                })
                await res.cookie('auth', { phone: user.phone, password: req.query.password }, { signed: true, maxAge: 90000 * 90000 * 990000 * 900000, httpOnly: true })
                await res.cookie('is_auth', true, { signed: true, httpOnly: true })

                return res.redirect('/')
            }



        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }


    }

    async logIn(req, res) {
        try {
            let suc = false
            let old = {}
            let error;
            if (req.query.status) {
                if (req.query.status == 'phoneLogin' && !req.query.phone) {
                    error = 'لطفا نام کاربری را وارد کنید'
                }
                else if (req.query.status == 'phoneLogin' && !req.query.phone) {
                    error = 'لطفا شماره موبایل را وارد کنید'
                }
                else if (!req.query.password) {
                    old = req.query
                    error = 'لطفا رمز عبور را وارد کنید'
                }

            }

            let query;
            old = req.query

            if (req.query.phone && req.query.password) {
                let user = await Buyer.findOne({ phone: req.query.phone })
                if (user && user.password == req.query.password) {
                    //set coocki
                    await res.cookie('auth', { phone: user.phone, password: req.query.password }, { signed: true, maxAge: 90000 * 90000 * 990000 * 900000, httpOnly: true })
                    await res.cookie('is_auth', true, { signed: true, httpOnly: true })
                    suc = true
                    res.redirect('/')


                }
                else {
                    // throw error
                    error = 'شماره موبایل یا رمز عبور صحیح نمیباشد!'
                    req.flash('formData', old)
                    return res.render('buyer/login.ejs', { error, oldData: req.flash('formData') || [], suc })


                }

            }
            else {
                req.flash('formData', old)
                return res.render('buyer/login.ejs', { req, error, oldData: req.flash('formData') || [], suc })

            }
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async addToCard(req, res) {
        try {
            let error = {}
            if (!req.body || !req.body.id || !req.body.number) {
                error.err = true
                error.msg = 'مشکلی رخ داده لطفا سایت را دوباره بارگذاری کنید یا از مرورگر دیگری استفاده کنید'
                return res.send(error)
            }
            let user = await this.getUser(req, res)

            if (!await this.is_auth(req, res)) {
                error.err = true
                error.msg = 'اعتبار نشست شما به پایان رسیده لطفا دوباره وارد سایت شوید(log in)'
                return res.send(error)
            }
            if (await this.userType(req, res) == 'seller') {
                error.err = true
                error.msg = 'فعلا فروشندگان نمیتوانند از سایت خرید بزن'
                return res.send(error)
            }

            let product = await Product.findById(req.body.id)
            if (!product) {
                error.err = true
                error.msg = 'محصول مورد نظر بنا به دلایلی از دسترس خارج شده است و یا نا موجود شد.'
                return res.send(error)
            }

            if (product.exsist < req.body.number) {
                error.err = true
                error.msg = 'تعداد سفارش شما بیش از کالای های موجود میباشد!'
                return res.send(error)
            }

            let isInCard = await this.isInCard(req, res, user, product);
            if (isInCard) {
                error.err = true
                error.msg = 'در سبد خرید شما موجود میباشد!'
                return res.send(error)
            }


            // await Buyer.updateOne(
            //     { _id: user.id },
            //     { "$push": { "card": { pro: req.body.id, count: parseInt(req.body.number) } } }
            // )

            await Card.create({
                pro: req.body.id,
                count: parseInt(req.body.number),
                buyer: user.id
            })

            //add number of card

            // await Product.updateOne(
            //     { _id: product.id },
            //     { exsist: product.exsist - parseInt(req.body.number) }
            // )
            // error.err = false
            return res.send(error)
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async removeFromCard(req, res) {
        try {
            let user = await this.getUser(req, res)
            let product = await Product.findById(req.params.id)

            if (!user) {
                return await this.setError(req, res, "اعتبار نشست شما به پایان رسیده لطفا مجددا وارد سایت شوید ", "buyerError", '/buyer')
            }

            let buyer = await Buyer.findById(user.id)
            if (!await this.isInCard(req, res, user, product)) {
                return await this.setError(req, res, "محصول مورد نظر یافت نشد و یا توسط فروشنده حذف شده است!", "buyerError", '/buyer')
            }

            //remove from card

            if (await this.isInCard(req, res, user, product)) {
                let card = await Card.findOne({ pro: req.params.id, buyer: user.id })

                card.remove()
            }

            req.flash("removeFromCard", "محصول حذف شد")
            return res.redirect(req.header('Referer') || '/buyer')
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async addToFavorite(req, res) {


    }

    // shop operation-------------------------------------------------------------------------------
    async fillShop(req, res) {// card nc
        let user = await this.getUser(req, res)
        let payment = true // get false by defult
        let cardPrice = 0
        let card = await this.Qcard(req, res)
        cardPrice = await this.computePrice(req, res, user)
        let cardEmpty = false
        let cart = await this.getCard(req, res, user.id)

        if (!card) {
            return res.redirect('/buyer/card')
        }
        if (cardPrice == 0) {
            cardEmpty = true
            req.flash('notExist', cardEmpty)
            return res.redirect("/buyer/card")
        }

        if (cardPrice > 50000000) {
            cardEmpty = true
            req.flash('moreLong', "شما نمیتوانید مبلغ بیش از 50 میلیون تومان را از کارت خود پرداخت کنید")
            return res.redirect("/buyer/card")
        }

        cardPrice = cardPrice * 10
        // //منتظر برای پرداخت و خالی کردن سبد خرید و تبدیل به سفارش
        let parameters = {
            merchant_id: '49f4ca56-74ba-44ff-af24-eb0b784baa97',
            amount: cardPrice,
            callback_url: "http://localhost:3000/buyer/paymentChecker",
            description: `بابت خرید محصول از سایت کینگ کارپت`,
        }

        let options = {
            method: 'POST',
            url: 'https://api.zarinpal.com/pg/v4/payment/request.json',
            headers: {
                'cache-control': ' no-cache',
                'content-type': 'application/json'
            },
            body: parameters,
            json: true
        }

        let sendRequest
        try {
            sendRequest = () => {
                return new Promise((resolve, reject) => {
                    request.post(options, (err, res, body) => {
                        if (err) return reject(err)
                        const authority = body.data.authority;
                        resolve(authority);
                    })
                })
            }

            //usage

        } catch (error) {
            res.send('مشکلی در صفحه پرداخت پیش آمده است. لطفا کمی بعد امتحان نمایید' + "  " + error)
        }
        try {
            const auth = await sendRequest()
            res.redirect('https://www.zarinpal.com/pg/StartPay/' + auth)
        } catch (error) {
            res.send('مشکلی در صفحه پرداخت پیش آمده است. لطفا کمی بعد امتحان نمایید' + "  " + error)
        }
    }

    async paymentChecker(req, res, next) {
        let user = await this.getUser(req, res)
        let payment = false // get false by defult
        let cardPrice = 0
        let card = await this.Qcard(req, res)
        cardPrice = await this.computePrice(req, res, user)
        let cardEmpty = false
        let cart = await this.getCard(req, res, user.id)

        if (req.query.Status == 'OK') {
            payment = true
        }

        // //check
        if (payment == true) {
            let history = await this.emptyCardToOrder(req, res)
            let status = true
            res.render("orderResult", { history, cardPrice, req, card, status })
        } else if (payment == false) {
            let history = await this.createFalsePayment(req, res)
            let status = false
            res.render("orderResult", { history, cardPrice, req, card, status })
        }
    }

    async emptyCardToOrder(req, res) { //card nc
        let user = await this.getUser(req, res)
        let cart = await this.getCard(req, res, user.id)
        let history = []
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].pro.exsist >= cart[i].count) {
                let ord = await Order.create({
                    seller: cart[i].pro.seller,
                    user: user.id,
                    product: cart[i].pro.id,
                    fullName: user.fullName,
                    phone: user.phone,
                    address: user.address,
                    count: cart[i].count,
                    price: cart[i].pro.price * cart[i].count
                })
                let code = await this.followCode(req, res)
                let his = await OrderHistory.create({
                    seller: cart[i].pro.seller,
                    buyer: user.id,
                    order: ord.id,
                    product: cart[i].pro.id,
                    sent: false,
                    pay: false,
                    address: user.address,
                    count: cart[i].count,
                    price: cart[i].pro.price * cart[i].count,
                    code: code,
                    title: cart[i].pro.title,
                    status: true
                })

                await Product.updateOne(
                    { _id: cart[i].pro.id },
                    { inOrder: (parseInt(cart[i].pro.inOrder) + parseInt(cart[i].count)) }
                )
                await Product.updateOne(
                    { _id: cart[i].pro.id },
                    { solde: (parseInt(cart[i].pro.solde) + parseInt(cart[i].count)) }
                )
                await Product.updateOne(
                    { _id: cart[i].pro.id },
                    { exsist: (parseInt(cart[i].pro.exsist) - parseInt(cart[i].count)) }
                )

                cart[i].remove()
                history.push(his)
            }

        }
        return history

    }

    async createFalsePayment(req, res) { //card nc
        let user = await this.getUser(req, res)
        let cart = await this.getCard(req, res, user.id)
        let history = []
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].pro.exsist >= cart[i].count) {
                let code = await this.followCode(req, res)
                let his = await OrderHistory.create({
                    seller: cart[i].pro.seller,
                    buyer: user.id,
                    product: cart[i].pro.id,
                    sent: false,
                    pay: false,
                    address: user.address,
                    count: cart[i].count,
                    price: cart[i].pro.price * cart[i].count,
                    code: code,
                    title: cart[i].pro.title,
                    status: false
                })

                history.push(his)
            }

        }
        return history

    }
    //-----------------------------------------------------------------------------------------------
    async contactUs(req, res) {
        let user = await this.getUser(req, res)

        return res.render('buyer/contactUs', { buyer: user, user, errors: req.flash("errors") || [] })
    }

    async contactUs_post(req, res) {
        try {
            let user = await this.getUser(req, res)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("errors", errors.errors)
                return res.redirect(req.header("Referer") || "/");
            }

            await ContactUs.create({
                fullName: user.fullName,
                phone: user.phone,
                body: req.body.body,
                userType: 1,
                user: user.id
            })
            return res.redirect('/buyer')
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async card(req, res) {

        let card = await this.Qcard(req, res)
        if (card.card == '') {
            res.render('cartEmpty', { req, card })
        }
        else {
            res.render('cart', { req, long: req.flash('moreLong'), card, cardEmpty: req.flash('notExist') })
        }

    }

    async upgradeCard(req, res) {
        let product = await Product.findById(req.body.proId)
        let error = {}

        if (!product) {
            error.fire = true
            error.msg = "یکی از محصولات سبد خرید یافت نشد، ممکن است از طرف فروشنده محصول حذف شده باشد!"
            return res.send(error)
        }

        let count = req.body.count
        if (!req.body.count || req.body.count == 0) {
            count = 1
        }

        if (req.body.count <= 0) {
            error.err = true
            error.msg = 'تعداد سفارش نمیتوانت کمتر از 1 باشد، درصورت وارد نکردن تعداد بیش از1، تعداد سفارش 1 در نظر گرفته میشود'
            return res.send(error)
        }


        await Card.updateOne(
            { _id: req.body.id },
            { count: count }
        )
        error.err = false
        return res.send(error)


    }

    async checkPassword(req, res) {
        let error = false
        let user = await this.getUser(req, res)
        if (req.body.password != user.password) {
            error = true
            res.send(error)
        }
        res.send(error)
    }

    async updateUserAccount(req, res) { //NCH
        // req.flash("errors", errors.errors)
        let pc = false
        let user = await this.getUser(req, res)
        let us = user.password
        if (!user) {
            return res.redirect('/')
        }
        let updat = {}

        if (!req.body.phone || !req.body.address || !req.body.name || !req.body.family) {
            req.flash("error", "شما نمیتوانید فیلدهایی بجز فیلد های رمز عبور را خالی بفرستید. لطفا صحت اطلاعات خود را چک کنید")
            return res.redirect('/buyer')
        }
        //change info
        if (req.body.phone && req.body.address && req.body.name && req.body.family) {
            updat.phone = req.body.phone
            updat.address = req.body.address
            updat.name = req.body.name
            updat.family = req.body.family
            updat.fullName = req.body.name + " " + req.body.family
        }

        //change password
        if (req.body.currentPassword && req.body.newPassword && req.body.confirmPassword) {
            if (user.password != req.body.currentPassword) {
                req.flash("error", "پسورد فعلی شما صحیح نمیباشد!")
                return res.redirect('/buyer')
            }
            if (req.body.newPassword != req.body.confirmPassword) {
                req.flash("error", "پسورد های شما یکسان نمیباشد. لطفا از ابتدا پر کنید!")
                return res.redirect('/buyer')
            }
            if (user.password == req.body.currentPassword && req.body.newPassword == req.body.confirmPassword) {
                updat.password = req.body.confirmPassword
                await res.clearCookie('auth')
                await res.cookie('is_auth', false, { signed: true, httpOnly: true })
                await res.cookie('auth', { phone: user.phone, password: req.body.confirmPassword }, { signed: true, maxAge: 90000 * 90000 * 990000 * 900000, httpOnly: true })
                await res.cookie('is_auth', true, { signed: true, httpOnly: true })
                pc = true
            }
        }
        if (!req.body.currentPassword && req.body.newPassword && req.body.confirmPassword) {
            req.flash("error", "فیلد رمز عبور فعلی نمیتواند خالی بماند")
            return res.redirect('/buyer')
        }

        //change phone

        if (req.body.phone && req.body.phone != user.phone) {
            let buyer = await Buyer.find({}).select("phone")
            let count = 0
            buyer.forEach(buyer => {
                if (buyer.phone == req.body.phone) {
                    count = count + 1
                }
            })
            if (count > 0) {
                req.flash("error", 'همچین شماره موبایلی از قبل وجود دارد!')
                return res.redirect('/buyer')
            }
            updat.userName = req.body.phone
            updat.phone = req.body.phone
            await res.clearCookie('auth')
            await res.cookie('is_auth', false, { signed: true, httpOnly: true })
            // console.log(pc);
            // console.log(us);
            if (pc) {
                await res.cookie('auth', { phone: req.body.phone, password: req.body.confirmPassword }, { signed: true, maxAge: 90000 * 90000 * 990000 * 900000, httpOnly: true })
                await res.cookie('is_auth', true, { signed: true, httpOnly: true })
            }
            else {
                await res.cookie('auth', { phone: req.body.phone, password: us }, { signed: true, maxAge: 90000 * 90000 * 990000 * 900000, httpOnly: true })
                await res.cookie('is_auth', true, { signed: true, httpOnly: true })
            }

        }

        await Buyer.updateOne(
            { _id: user.id },
            { ...updat }
        )
        req.flash('success', 'تغیرات با موفقیت اعمال شد.')
        return res.redirect('/buyer')
    }

    async orderInvoice(req, res) {
        let order = await Order.findById(req.params.id)
        let product = await Product.findById(order.product)
        let seller = await User.findById(product.seller)

        let taxation = parseInt((product.price / 100) * 9.3)

        taxation = product.price + taxation
        taxation = taxation * order.count

        res.render('sellerAdmin/orderInvoice', { order, product, taxation, seller })
    }

}
module.exports = new buyerController