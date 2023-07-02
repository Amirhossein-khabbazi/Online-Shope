const Product = require('./../../../model/Product')
const Category = require('./../../../model/category')
const User = require('./../../../model/User')
const Comment = require('./../../../model/comment')
const ContactUs = require('./../../../model/contactUs')
const Controller = require('./../controller')
const { find } = require('./../../../model/Product')
const { query } = require('express-validator')

class bestController extends Controller {

    async index(req , res){
        let query ={}
        let isCategory = false
        if(req.query.category){
            query.category = req.query.category
        }


        let page = req.query.page || 1;
        let product = await Product.paginate({...query , promiss : true},{page ,populate : 'seller' ,sort : {like : -1} , limit : 6})
        let category = await Category.find({})
        let user = await User.find({seller : true})

        res.render('best' , {product , category , req , user})
    }

    async bestSingle(req , res){
        let category = await Category.find({})
        let user = await User.find({seller : true})
        let product = await Product.find({slug : req.params.slug}).populate('seller')
        product = product[0]
        let comment = await Comment.find({product : product.id , permission : true}).populate('child')
        
        res.render('best-single' , {category , user , product , comment , req})
    }


}
module.exports = new bestController;