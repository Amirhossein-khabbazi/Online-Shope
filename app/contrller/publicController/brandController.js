const Product = require('../../../model/Product')
const Category = require('../../../model/category')
const User = require('../../../model/User')
const ContactUs = require('../../../model/contactUs')
const Controller = require('../controller')
const { find } = require('../../../model/Product')

class brandController extends Controller {
   
    async index(req , res) {

        let category = await Category.find({})

        let card = await this.Qcard(req , res)

        let user = await User.find({seller : true})

        res.render('brand' , {req , user , category , card})
    }


}
module.exports = new brandController;