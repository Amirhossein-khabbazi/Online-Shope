const User = require('./../../../model/User')
const Product = require('./../../../model/Product')
const Category = require('./../../../model/category')
var isMongoID = require('mongodb').ObjectID
const controller = require('./../controller')

class shopController extends controller {

    async index(req, res) {
        // return console.log(req.query);
        let query = {}
        let Sbrand = '';
        let use, user;
        let specialBrand = false;
        if (req.params.id) {
            //throw error
            use = await User.find({ userName: req.params.id })
            query.seller = use[0].id
            Sbrand = req.params.id
            user = use[0]
            specialBrand = true
        }
        //____________________________________________________________________________________________________________
        //multi filter
        let multiCategory = [], flag = 'false'; let result;
        if (req.query.multiCategory == 'true') {
            for (let i in req.query) {
                multiCategory.push(i)
            }

            if (multiCategory.length > 1) {
                let product = await Product.find({ promiss: true })
                result = await this.cateMatch(multiCategory, product, req)
                flag = 'true'
                query.slug = []
                result.forEach(r => {
                    query.slug.push(r.slug)
                })
            }

        }

        //____________________________________________________________________________________________________________
        //multi size


        //_____________________________________________________________________________________________________________
        //search
        if (req.query.search) {
            query.title = new RegExp(req.query.search, 'gi')
        }
        let lim = 1
        if (req.query.category && req.query.category !== 'all' && flag == 'false') {
            query.category = req.query.category
            lim = 1000000
        }
        //______________________________________________________________________________________________________________
        //berands
        let sellerUser = await User.find({ seller: true })

        //______________________________________________________________________________________________________________
        //category
        let category = await Category.find({})

        //______________________________________________________________________________________________________________
        //4 popular
        let Pproduct = await this.getLeast(res, req, await Product.find({ promiss: true }).sort({ like: -1 }).populate('seller'), 3)

        //______________________________________________________________________________________________________________
        //products

        //______________________________________________________________________________________________________________
        //get card
        let card = await this.Qcard(req , res)
        // console.log(card);

        let page = req.query.page || 1; let pro = {}; let product = {}
        product = await Product.paginate({ ...query, promiss: true }, { page, sort: { createdAt: -1 }, limit: 1 })
        // console.log(product);
        if (specialBrand == false) {
            res.render('shop', {card, Sbrand, product, category, sellerUser, req, user, req, Pproduct })
        }
        else if (specialBrand == true) {
            res.render('specialBrand', {card, Sbrand, product, category, sellerUser, req, user, req })
        }

    }



}
module.exports = new shopController