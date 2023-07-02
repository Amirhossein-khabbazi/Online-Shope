const User = require('model/User')
const Product = require('model/Product')
const { validationResult } = require('express-validator');
const Order = require('model/order')
const Controller = require('../controller')
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { param } = require('../../router/admin');


class userController extends Controller {

    async index(req, res) { //NC
        let user = await User.find({ seller: true }).sort({ createdAt: -1 })
        let admin = await this.getUser(req, res)

        let product = await Product.find({ seller: user.id })

        //filter

        res.render('admin/seller/seller', { user, product, admin })
    }

    async create(req, res) { //NC
        //send Errors
        res.render('admin/seller/createSeller', { errors: req.flash("errors") || [] })
    }

    async create_post(req, res) { // NC
        //validation

        const errors = validationResult(req);
        let imgErr = {}
        if (!req.file) {
            imgErr.value = ''
            imgErr.msg = 'وارد کردن لوگو الزامیست'
            imgErr.param = 'logo'
            imgErr.location = 'body'
        }
        if (!errors.isEmpty() || !req.file) {
            if (req.file)
                fs.unlink(req.file.path, (err) => { })
            errors.errors.push(imgErr)
            req.flash("errors", errors.errors)
            return res.redirect(req.header("Referer") || "/");
        }

        //check for error

        //creat
        let logo = this.imageResize(req.file)
        let user = User.create({
            name: req.body.name,
            family: req.body.family,
            fullName: req.body.name + " " + req.body.family,
            userName: req.body.userName,
            password: req.body.password,
            phone: req.body.phone,
            admin: false,
            masterAdmin: false,
            ban: false,
            seller: true,
            brand: req.body.brand,
            slug: this.slug(req.body.name + " " + req.body.family),
            n_product: 0,
            logo: logo['original'],
            baner: '',
            Slogan: req.body.Slogan,
            bankNum: req.body.bankNum,
            address: req.body.address,
        })

        // redirection
        return res.redirect('/admin/users')
    }

    async addBaner(req, res) {

        if (!req.file) {
            return res.redirect('/admin/users')
        }
        let user = await User.findById(req.params.id)
        let baner = this.imageResize(req.file)
        if (user.baner != '') {
            fs.unlinkSync(`./public${user.baner}`)
        }
        await User.updateOne(
            { _id: req.params.id },
            { baner: baner['original'] }
        )
        return res.redirect('/admin/users')

    }

    async remove(req, res) { //NC
        //check for errors

        //remove products
        let user = await User.findById(req.params.id)
        let product = await Product.find({ seller: user.id })
        let card = await Card.find({ product: product.id })
        product.forEach(ord => {
            
            ord.remove()
        })
        card.forEach(ord => {
            
            ord.remove()
        })
        if (fs.existsSync(`./public${user.logo}`)) {
            fs.unlinkSync(`./public${user.logo}`)
        }
        if (user.baner != '') {
            fs.unlinkSync(`./public${user.baner}`)
        }
        //remov orders
        let orders = await Order.find({ seller: user.id })
        orders.forEach(ord => {
            ord.remove()
        })
        //remove user
        user.remove()

        //redirection
        return res.redirect(req.header('Referer') || '/')
    }

    async edit(req, res) { //NC

        let user = await User.findById(req.params.id)

        //send validation results

        // throw error

        //render
        return res.render('admin/seller/editSeller', { user, errors: req.flash("errors") || [] })


    }

    async edit_post(req, res) { //NC
        //validation
        let use = await User.findById(req.params.id)
        //throw errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("errors", errors.errors)
            return res.redirect(req.header("Referer") || "/");
        }
        let objForUpdate = {};
        //update
        if (req.file) {
            if (fs.existsSync(`./public${use.logo}`)) {
                fs.unlinkSync(`./public${use.logo}`)
            }

            let img = this.imageResize(req.file)
            objForUpdate.logo = img['original']
        }
        let user = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { ...req.body, ...objForUpdate } })
        await User.updateOne(
            { _id: user.id },
            { fullName: req.body.name + " " + req.body.family }
        )
        return res.redirect('/admin/users')
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }

    async ban(req, res) {
        await Product.updateMany(
            { seller: req.params.id },
            { promiss: false }
        )
        await User.updateOne(
            { _id: req.params.id },
            { ban: true }
        )

        res.redirect('/admin/users')
    }

    async setFree(req, res) {
        await Product.updateMany(
            { seller: req.params.id },
            { promiss: true }
        )
        await User.updateOne(
            { _id: req.params.id },
            { ban: false }
        )

        res.redirect('/admin/users')
    }

    imageResize(image) {
        const imageInfo = path.parse(image.path);

        let addresImages = {};
        addresImages['original'] = this.getUrlImage(`${image.destination}/${image.filename}`);

        // const resize = size => {
        //     let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;

        //     addresImages[size] = this.getUrlImage(`${image.destination}/${imageName}`);

        //     sharp(image.path)
        //         .resize(size, null)
        //         .toFile(`${image.destination}/${imageName}`);
        // }

        // ['original'].map(resize);

        return addresImages;
    }

    getUrlImage(dir) {
        return dir.substring(8);
    }
}
module.exports = new userController
