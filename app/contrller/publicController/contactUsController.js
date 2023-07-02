const User = require('./../../../model/User')
const Product = require('./../../../model/Product')
const Category = require('./../../../model/category')
const ContactUs = require('./../../../model/contactUs')
var isMongoID = require('mongodb').ObjectID
const controller = require('./../controller')

class contactUsController extends controller {

    async contact_request(req, res) {
        let user = await this.is_auth(req, res)
        let error = {}
        let old = req.body
        if (!req.body.name || !req.body.phone || !req.body.message) {
            error.msg = true
            return res.send(error)
        }
        else if (req.body.name && req.body.phone && req.body.message) {
            let con = await ContactUs.findOne({ req: true, phone: req.body.phone })
            if (con) {
                if (req.body.type == "req") {
                    error.ret = true
                    return res.send(error)
                }
            } else {
                error.msg = false
                let userType = 3;
                let ID = ''
                if (user == "true") {
                    userType = 1
                    ID = user.id
                }
                if (user == "true" && user.seller) {
                    userType = 2
                    ID = user.id
                }
                let requ = false
                if (req.body.type == "req") {
                    requ = true
                }
                await ContactUs.create({
                    fullName: req.body.name,
                    phone: req.body.phone,
                    body: req.body.message,
                    req: requ,
                    userType: userType,
                })
                res.send(error)
            }

        }
    }

    async contactUs(req, res) {
        res.render('contactUs', { error: req.flash('Cerror') || [], error: req.flash('error') ,old: req.flash('formData')[0] || [] })
    }

    async contactUs_post(req, res) {
        let error = 'false';
        if (!req.body.name) {
            error = 'لطفا نام و نام خانوادگی خود را وارد کنید'
        }
        else if (!req.body.phone) {
            error = 'لطفا شماره موبایل خود را وارد کنید'
        }
        else if (!req.body.subject) {
            error = 'لطفا موضوع را وارد کنید'
        }
        else if (!req.body.message) {
            error = 'شما هیچ پیامی ننوشته اید'
        }
        if (error != 'false') {
            req.flash('Cerror', error)
            req.flash('formData', req.body)
            return res.redirect('/contact-us')
        }

        await ContactUs.create({
            fullName: req.body.name,
            phone: req.body.phone,
            body: req.body.message,
            subject: req.body.subject,
            userType: 3
        })
        req.flash('contact', 'true')
        return res.redirect('/')

    }
}
module.exports = new contactUsController