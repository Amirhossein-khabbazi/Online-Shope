const User = require('model/User')
const Product = require('model/Product')
const { validationResult } = require('express-validator');
const Order = require('model/order')
const Controller = require('../controller')
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { param } = require('../../router/admin');


class admins extends Controller {

    async index(req, res) { //NC
        let user = await User.find({ admin: true, masterAdmin: false }).sort({ createdAt: -1 })
        let admin = await this.getUser(req, res)

        let product = await Product.find({ seller: user.id })

        //filter

        res.render('admin/admins/Admin', { user, product, admin })
    }

    async create(req, res) { //NC
        //send Errors
        res.render('admin/admins/createAdmin', { errors: req.flash("errors") || [] })
    }

    async create_post(req, res) { // NC
        //validation

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash("errors", errors.errors)
            return res.redirect(req.header("Referer") || "/");
        }

        //check for error

        //creat
        let user = User.create({
            name: req.body.name,
            family: req.body.family,
            fullName: req.body.name + " " + req.body.family,
            userName: req.body.userName,
            password: req.body.password,
            phone: req.body.phone,
            admin: true,
            masterAdmin: false,
            ban: false,
            seller: false,
            slug: this.slug(req.body.name + " " + req.body.family),
        })

        // redirection
        return res.redirect('/admin/admins')
    }

    async remove(req, res) { //NC
        //check for errors

        //remove products
        let user = await User.findById(req.params.id)
        //remov orders
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
        return res.render('admin/admins/editAdmin', { user, errors: req.flash("errors") || [] })


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

        let user = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { ...req.body } })
        await User.updateOne(
            { _id: user.id },
            { fullName: req.body.name + " " + req.body.family }
        )
        return res.redirect('/admin/admins')
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
module.exports = new admins
