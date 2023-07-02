const Controller = require('../controller')
const User = require('./../../../model/User')
const Buyer = require('./../../../model/buyer')
const Product = require('./../../../model/Product')
const Card = require('./../../../model/card')
const Err = require('./../../../model/error')
const ContactUs = require('./../../../model/contactUs')
const Message = require('./../../../model/message')
const Category = require('./../../../model/category')
const Order = require('./../../../model/order')
const OrderHistory = require('./../../../model/orderHistory')
const Comment = require('./../../../model/comment')
const { validationResult } = require('express-validator');
const { all } = require('../../router')
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const swal = require('sweetalert')
const order = require('./../../../model/order')

class sellerPanelController extends Controller {

    async index(req, res) {

    }

    async dashbordOne(req, res) { //NC
        try {
            let user = await this.getUser(req, res);

            let message = await this.getMessage(user.id)
            //Error if(!user)
            let product = await Product.find({ seller: user.id })
            let allPro = product.length;//all products

            let allSell = 0;
            product.forEach(pro => { // all sell so far
                allSell = allSell + pro.solde
            })

            let allOrder = 0;
            product.forEach(pro => { // all order so far
                allOrder = allOrder + pro.inOrder
            })

            let notPromiss = 0;
            product.forEach(pro => { // false Promiss
                if (pro.promiss === false) {
                    notPromiss += 1
                }
            })
            //باید امکانات بیشتری اضافه گردد

            return res.render('sellerAdmin/dashbordOne', { allPro, allSell, allOrder, notPromiss, user, message })
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async dashbordTwo(req, res) { //NC
        try {
            let user = await this.getUser(req, res)
            //Error if(!user)
            let message = await this.getMessage(user.id)

            let product = await Product.find({ seller: user.id }).sort({ createdAt: -1 })

            //avarage likes
            let likes = 0
            product.forEach(pro => {
                likes += pro.like
            })
            let avgLike = likes / product.length
            avgLike = Number((avgLike).toFixed(2));
            //-------------------------------------------------------
            // all sell so far
            let allSell = 0;
            product.forEach(pro => {
                allSell = allSell + pro.solde
            })


            //--------------------------------------------------------
            // all order so far
            let allOrder = 0;
            product.forEach(pro => {
                allOrder = allOrder + pro.inOrder
            })
            req.flash('sweet', 'its working')
            let Delete = 0;
            if (req.flash('del')[0] == '1') {
                Delete = 1
            }
            if (!avgLike) {
                avgLike = 0
            }
            return res.render('sellerAdmin/dashbordTwo', { message, user, avgLike, allSell, allOrder, product, deleteOrder: req.flash("deleteOrder"), sweet: req.flash('sweet'), Delete })
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async dashbordTree(req, res) {//NC
        try {
            let user = await this.getUser(req, res)
            let message = await this.getMessage(user.id)

            //Error if(!user)

            let order = await Order.find({ seller: user.id }).populate('product')

            return res.render('sellerAdmin/dashbordThree', { user, order, message })
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }


    }

    async creatPro(req, res) {
        try {
            let user = await this.getUser(req, res)
            let message = await this.getMessage(user.id)

            let category = await Category.find({})
            //Error if(!user)

            return res.render('sellerAdmin/addProduct', { message, user, category, errors: req.flash("errors") || [], old: req.flash("proData")[0] || [] })

        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async creatPro_post(req, res) {
        try {
            let user = await this.getUser(req, res)

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("errors", errors.errors)
                req.flash("proData", req.body)
                if (req.file)
                    fs.unlink(req.file.path, (err) => { })

                return res.redirect(req.header("Referer") || "/");
            }
            let img = this.ImageResize(req.file)
            let pro = await Product.create({
                title: req.body.title,
                body: req.body.body,
                price: req.body.price,
                exsist: req.body.exsist,
                size: req.body.size,
                abrishamUsed: req.body.abrishamUsed,
                category: req.body.category,
                seller: user.id,
                images: img,
                thump: img[256],
                IMG480: img[256],
                IMG720: img[1080],
                IMG1080: img[1080],
                slug: this.slug(req.body.title)
            })

            await User.updateOne(
                { _id: user.id },
                { n_product: parseInt(user.n_product) + 1 }
            )


            return res.redirect('/sellerPanel/dashbordTwo')
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async editPro(req, res) { //NC
        try {
            let user = await this.getUser(req, res)
            //Error if(!user)

            let product = await Product.findById(req.params.id)
            let category = await Category.find({})
            //handel Error

            return res.render('sellerAdmin/editProduct', { product, category, errors: req.flash("errors") || [], old: req.flash("formData")[0] || [] })

        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async editPro_post(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("errors", errors.errors)
                if (req.file)
                    fs.unlink(req.file.path, (err) => { })
                return res.redirect(req.header("Referer") || "/");
            }

            //throw error

            let objForUpdate = {};
            let product = await Product.findById(req.params.id)

            //throw error

            if (req.file) {
                Object.values(product.images).forEach(img => {
                    if (fs.existsSync(`./public${img}`)) {
                        fs.unlinkSync(`./public${img}`)
                    }
                })
                let img = this.ImageResize(req.file)
                objForUpdate.images = img
                objForUpdate.thump = img[256]
                objForUpdate.IMG1080 = img[1080]
            } else {
                objForUpdate.images = product.images
            }
            await Product.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body, ...objForUpdate } })
            await Product.updateOne(
                { _id: req.params.id },
                { slug: this.slug(req.body.title), promiss: false }
            )

            return res.redirect('/sellerPanel/dashbordTwo')
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async contactUs(req, res) {
        try {
            let user = await this.getUser(req, res)
            let message = await this.getMessage(user.id)

            return res.render('sellerAdmin/contactUs', { message, user, errors: req.flash("errors") || [] })
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

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
                userType: 2,
                user: user.id
            })
            swal("Hello world!");
            return res.redirect('/sellerPanel/dashbordTwo')
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async removeProduct(req, res) {
        try {
            let user = await this.getUser(req, res)
            //throw errors
            let error = false
            //test
            let product = await Product.findById(req.params.id)

            let orders = await Order.find({ product: product.id })
            // orders.forEach(ord => {
            //     ord.remove()
            // })
            if (orders.length != 0) {
                error = true
                req.flash("deleteOrder", error)
                return res.redirect(req.header('Referer') || '/sellerPanel')
            }
            let comment = await Comment.find({ product: req.params.id })
            comment.forEach(async com => {
                await com.remove()
            })

            let card = await Card.find({ pro: req.params.id })
            card.forEach(async card => {
                await card.remove()
            })


            Object.values(product.images).forEach(img => { if (fs.existsSync(`./public${img}`)) { fs.unlinkSync(`./public${img}`) } })
            product.remove()
            req.flash('del', '1')

            await User.updateOne(
                { _id: user.id },
                { n_product: parseInt(user.n_product) - 1 }
            )

            return res.redirect(req.header('Referer') || '/sellerPanel')
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    ImageResize(image) {
        const imageInfo = path.parse(image.path);

        let addresImages = {};
        addresImages['original'] = this.getUrlImage(`${image.destination}/${image.filename}`);

        const resize = size => {
            let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;

            addresImages[size] = this.getUrlImage(`${image.destination}/${imageName}`);

            sharp(image.path)
                .resize(size, null)
                .toFile(`${image.destination}/${imageName}`);
        }

        [1080, 256, 128].map(resize);

        return addresImages;
    }

    getUrlImage(dir) {
        return dir.substring(8);
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }

    async removeOrder(req, res) {
        //throw error
        try {
            let order = await Order.findById(req.params.id)
            let product = await Product.findById(order.product)

            // return console.log(product.inOrder +"--"+ order.count );
            await Product.updateOne(
                { _id: order.product },
                { inOrder: product.inOrder - order.count }
            )

            // await Product.updateOne(
            //     { _id: order.product },
            //     { exsist: product.exsist + order.count }
            // )

            order.remove()
            //sweet alert
            res.redirect('/sellerPanel/dashbordThree')
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }
    }

    async soledOrder(req, res) {
        try {
            let order = await Order.findById(req.params.id)
            let product = await Product.findById(order.product)

            await Product.updateOne(
                { _id: order.product },
                { inOrder: product.inOrder - order.count }
            )

            // await Product.updateOne(
            //     { _id: order.product },
            //     { solde: product.solde + order.count }
            // )



            order.remove()
            //sweet alert
            res.redirect('/sellerPanel/dashbordThree')

        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async orderInvoice(req, res) {
        try {
            let order = await Order.findById(req.params.id)
            let product = await Product.findById(order.product)
            let seller = await User.findById(product.seller)

            let taxation = parseInt((product.price / 100) * 9.3)

            taxation = product.price + taxation
            taxation = taxation * order.count

            res.render('sellerAdmin/orderInvoice', { order, product, taxation, seller })
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async showComments(req, res) {
        try {
            let page = req.query.page || 1
            let comment = await Comment.paginate({ product: req.params.id, permission: true, father: true }, { page, populate: 'product', sort: { createdAt: -1 }, limit: 20 })
            let user = await this.getUser(req, res);


            res.render('sellerAdmin/showComments', { comment, user })
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)

        }

    }

    async answerComment(req, res) {
        try {
            if (!req.body || !req.body.body || !req.body.id || !req.body.product) {
                throw new Error('مشکلی از طرف ما رخ داده لطفا صفحه را مجددا بارگزاری کنید ویا از مرورگر دیگری استفاده کنید')
            }

            let user = await this.getUser(req, res);



            let com = await Comment.findById(req.body.id).populate('child')
            if (com.child) {
                com.child.remove()
            }
            // console.log('here');
            let comment = await Comment.create({
                fullName: user.fullName,
                phone: user.phone,
                body: req.body.body,
                permission: true,
                product: req.body.product,
                father: false
            })


            // console.log(com);

            await Comment.updateOne(
                { _id: req.body.id },
                { child: comment.id }
            )

        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async accountSettingPage(req, res) {
        try {
            let user = await this.getUser(req, res);
            let message = await this.getMessage(user.id)

            res.render('sellerAdmin/accountSetting', { user, message, errors: req.flash("error") || [] })
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async checkUserName(req, res) {

        let user = await this.getUser(req, res)
        let result = {}

        let sellers = await User.find({}).select("userName")
        let count = 0
        sellers.forEach(sel => {
            if (sel.userName == req.body.userName) {
                count = count + 1
            }
        })


        if (count > 0) {
            if (user.userName == req.body.userName) {
                result = { s: false, n: true }
                res.send(result);
            }
            result = { s: false, n: false }
            res.send(result);
        }
        result = { s: true, n: false }
        res.send(result);


    }

    async accountSetting(req, res) {
        try {
            // req.flash("errors", errors.errors)
            let pc = false
            let user = await this.getUser(req, res)
            let us = user.password
            if (!user) {
                return res.redirect('/')
            }
            let updat = {}

            if (!req.body.name || !req.body.family || !req.body.phone || !req.body.brand || !req.body.userName) {
                req.flash("error", "شما نمیتوانید فیلدهایی بجز فیلد های رمز عبور را خالی بفرستید. لطفا صحت اطلاعات خود را چک کنید")
                return res.redirect('/sellerPanel/acountSetting')
            }
            //change info
            if (req.body.name && req.body.family && req.body.phone && req.body.brand) {
                updat.name = req.body.name
                updat.family = req.body.family
                updat.phone = req.body.phone
                updat.brand = req.body.brand
                updat.fullName = req.body.name + ' ' + req.body.family
            }

            //change password
            if (req.body.peresentPassword && req.body.newPassword && req.body.repeadNewPassword) {
                if (user.password != req.body.peresentPassword) {
                    req.flash("error", "پسورد فعلی شما صحیح نمیباشد!")
                    return res.redirect('/sellerPanel/acountSetting')
                }
                if (req.body.newPassword != req.body.repeadNewPassword) {
                    req.flash("error", "پسورد های شما یکسان نمیباشد. لطفا از ابتدا پر کنید!")
                    return res.redirect('/sellerPanel/acountSetting')
                }
                if (user.password == req.body.peresentPassword && req.body.newPassword == req.body.repeadNewPassword) {
                    updat.password = req.body.repeadNewPassword
                    await res.clearCookie('auth')
                    await res.cookie('is_auth', false, { signed: true, httpOnly: true })
                    await res.cookie('auth', { userName: user.userName, password: req.body.repeadNewPassword }, { signed: true, maxAge: 9000000, httpOnly: true })
                    await res.cookie('is_auth', true, { signed: true, httpOnly: true })
                    pc = true
                }
            }
            if (!req.body.peresentPassword && req.body.newPassword && req.body.repeadNewPassword) {
                req.flash("error", "فیلد رمز عبور فعلی نمیتواند خالی بماند")
                return res.redirect('/sellerPanel/acountSetting')
            }

            //change userName

            if (req.body.userName && req.body.userName != user.userName) {
                let sellers = await User.find({}).select("userName")
                let count = 0
                sellers.forEach(sel => {
                    if (sel.userName == req.body.userName) {
                        count = count + 1
                    }
                })
                if (count > 0) {
                    req.flash("error", 'همچین نام کاربری از قبل وجود دارد!')
                    return res.redirect('/sellerPanel/acountSetting')
                }
                updat.userName = req.body.userName
                await res.clearCookie('auth')
                await res.cookie('is_auth', false, { signed: true, httpOnly: true })
                // console.log(pc);
                // console.log(us);
                if (pc) {
                    await res.cookie('auth', { userName: req.body.userName, password: req.body.repeadNewPassword }, { signed: true, maxAge: 9000000, httpOnly: true })
                    await res.cookie('is_auth', true, { signed: true, httpOnly: true })
                }
                else {
                    await res.cookie('auth', { userName: req.body.userName, password: us }, { signed: true, maxAge: 9000000, httpOnly: true })
                    await res.cookie('is_auth', true, { signed: true, httpOnly: true })
                }


            }


            await User.updateOne(
                { _id: user.id },
                { ...updat }
            )

            return res.redirect('/sellerPanel/acountSetting')
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async closeOrder(req, res) {
        try {
            let user = await this.getUser(req, res)
            let order = await Order.findById(req.params.id)
            let pro = await Product.findById(order.product)

            await Product.updateOne(
                { _id: order.product },
                { inOrder: parseInt(pro.inOrder) - parseInt(order.count) }
            )

            await OrderHistory.updateOne(
                { order: order.id },
                { sent: true }
            )
            order.remove()

            res.redirect('/sellerPanel/dashbordThree')
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

   
}
module.exports = new sellerPanelController