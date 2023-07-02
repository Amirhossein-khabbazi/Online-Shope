const Product = require('../../../model/Product')
const Category = require('../../../model/category')
const User = require('../../../model/User')
const ContactUs = require('../../../model/contactUs')
const Controller = require('../controller')
const { find } = require('../../../model/Product')

class historyController extends Controller {
   
    async index(req , res) {
        
    }


}
module.exports = new historyController;