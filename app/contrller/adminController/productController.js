const Product = require('./../../../model/Product')
const Comment = require('./../../../model/comment')
const Cate = require('./../../../model/category')
const Card = require('./../../../model/card')
const User = require('./../../../model/User')
const Order = require('./../../../model/order')
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { validationResult } = require('express-validator');

class productController {

    async index(req, res) {
        let product = await Product.find({}).populate('seller').sort({ createdAt: -1 })
        return res.render('admin/product/proList', { product })
    }

    async creat(req, res) {

        //send validation results
        let category = await Cate.find({})
        let seller = await User.find({})

        return res.render('admin/product/createPro', { category, seller, errors: req.flash("errors") || [] })
    }

    async create_post(req, res) { //NC

        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("errors", errors.errors)
            if (req.file)
                fs.unlink(req.file.path, (err) => { })
            return res.redirect(req.header("Referer") || "/");
        }


        //throw error

        //create
        let img = this.imageResize(req.file)

        let pro = await Product.create({
            title: req.body.title,
            body: req.body.body,
            price: req.body.price,
            exsist: req.body.exsist,
            size: req.body.size,
            abrishamUsed: req.body.abrishamUsed,
            category: req.body.category,
            seller: req.body.seller,
            images: img,
            thump: img[256],
            IMG1080: img[1080],
            slug: this.slug(req.body.title)
        })

       

        return res.redirect('/admin/products')
    }

    async edit(req, res) {

        //send validation results
        let category = await Cate.find({})
        let seller = await User.find({})
        let product = await Product.findById(req.params.id)

        return res.render('admin/product/editPro', { product, category, seller, errors: req.flash("errors") || [] })
    }

    async edit_post(req, res) { //NC

        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("errors", errors.errors)
            if (req.file)
                fs.unlink(req.file.path, (err) => { })
            return res.redirect(req.header("Referer") || "/");
        }
        let objForUpdate = {};
        let product = await Product.findById(req.params.id)

        //throw error

        if (req.file) {
            Object.values(product.images).forEach(img => fs.unlinkSync(`./public${img}`))
            let img = this.imageResize(req.file)
            objForUpdate.images = img
            objForUpdate.thump = img[256]
            objForUpdate.IMG1080 = img[1080]
        } else {
            objForUpdate.images = product.images
        }
        await Product.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body, ...objForUpdate } })
        await Product.updateOne(
            { _id: req.params.id },
            { slug: this.slug(req.body.title) }
        )

        return res.redirect('/admin/products')
    }

    imageResize(image) {
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

    async promis(req, res) {

        //throw error

        //let
        await Product.updateOne(
            { _id: req.params.id },
            { promiss: true }
        )
        return res.redirect('/admin/products')
    }

    async disPromis(req, res) {
        //throw error

        //let
        await Product.updateOne(
            { _id: req.params.id },
            { promiss: false }
        )
        return res.redirect('/admin/products')
    }

    async remove(req, res) {

        let product = await Product.findById(req.params.id)
        let comment = await Comment.find({ product: req.params.id })
        comment.forEach(async com => {
            await com.remove()
        })

        let card = await Card.find({ pro: req.params.id })
        card.forEach(async card => {
            await card.remove()
        })

        Object.values(product.images).forEach(img => fs.unlinkSync(`./public${img}`))

        product.remove()
        return res.redirect('/admin/products')
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }



}
module.exports = new productController
