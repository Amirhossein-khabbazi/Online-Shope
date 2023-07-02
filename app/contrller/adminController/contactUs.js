const { query } = require('express')
const { validationResult } = require('express-validator')
const Message = require('../../../model/message')
const ContactUs = require('../../../model/contactUs')
const User = require('../../../model/User')
const Controller = require('../controller')
class contactUs extends Controller {

    async index(req, res) {
        let page = req.query.page || 1
        let contact = await ContactUs.paginate({req : false}, { page, sort: { createdAt: -1 }, limit: 20 })

        res.render('admin/contactUs/contact', { contact })
    }

  

    async remove(req, res) {

        let contact = await ContactUs.findById(req.params.id)
        contact.remove()
        return res.redirect('/admin/contact')

    }

  

}
module.exports = new contactUs
