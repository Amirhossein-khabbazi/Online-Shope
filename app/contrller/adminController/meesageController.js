const { query } = require('express')
const { validationResult } = require('express-validator')
const Message = require('./../../../model/message')
const User = require('./../../../model/User')
const Controller = require('./../controller')
class meesageController extends Controller {

    async index(req, res) {
        let page = req.query.page || 1
        let message = await Message.paginate({}, { page, populate: ['user', 'admin'], sort: { createdAt: -1 }, limit: 20 })

        res.render('admin/message/message', { message })
    }

    async create(req, res) {
        let seller = await User.find({ seller: true })
        res.render('admin/message/create', { errors: req.flash("errors") || [], seller })
    }

    async create_post(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("errors", errors.errors)
            return res.redirect(req.header("Referer") || "/");
        }
        let admin = await this.getUser(req, res)
        let type;
        let user;
        if (req.body.user == 'ALL') {
            user = null
            type = 1
        } else {
            type = 2
            user = req.body.user
        }
        await Message.create({
            type: type,
            user: user,
            body: req.body.body,
            topic: req.body.topic,
            admin: admin.id
        })

        // redirection
        return res.redirect('/admin/message')

    }

    async remove(req, res) {

        let message = await Message.findById(req.params.id)
        message.remove()
        return res.redirect('/admin/message')

    }

    async edite(req, res) {
        let seller = await User.find({ seller: true })
        let message = await Message.findById(req.params.id)
        res.render('admin/message/edite', { errors: req.flash("errors") || [], message, seller })

    }

    async edite_post(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("errors", errors.errors)
            return res.redirect(req.header("Referer") || "/");
        }

        let type;
        let user;
        if (req.body.user == 'ALL') {
            user = null
            type = 1
        } else {
            type = 2
            user = req.body.user
        }

        let message = await Message.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                type: type,
                user: user,
                body: req.body.body,
                topic: req.body.topic

            }
        })

        return res.redirect('/admin/message')
    }

}
module.exports = new meesageController
