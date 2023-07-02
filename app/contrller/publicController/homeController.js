const Product = require('./../../../model/Product')
const Category = require('./../../../model/category')
const User = require('./../../../model/User')
const ContactUs = require('./../../../model/contactUs')
const Controller = require('./../controller')
const { find } = require('./../../../model/Product')

class homeController extends Controller {
    async index(req, res) {
        let error = '';
        //6 last products
        let Lproduct = await this.getLeast(req, res, await Product.find({ promiss: true }).sort({ createdAt: -1 }).populate('seller'), 6)


        //______________________________________________________________________________________________________________
        //category
        let category = await Category.find({})


        //______________________________________________________________________________________________________________
        //berands
        let user = await User.find({ seller: true }).sort({ n_product: -1 })
        let berand = await this.getLeast(req, res, user, 4)

        //______________________________________________________________________________________________________________
        //4 least popular
        let Pproduct = await this.getLeast(res, req, await Product.find({ promiss: true }).sort({ like: -1 }).populate('seller'), 12)


        //______________________________________________________________________________________________________________
        //4 least must sold
        let Sproduct = await this.getLeast(res, req, await Product.find({ promiss: true }).sort({ sold: -1 }).populate('seller'), 12)


        //______________________________________________________________________________________________________________
        //4 least chipest
        let Cproduct = await this.getLeast(res, req, await Product.find({ promiss: true }).sort({ price: -1 }).populate('seller'), 12)

        //______________________________________________________________________________________________________________
        //get card
        let card = await this.Qcard(req, res)
        //______________________________________________________________________________________________________________
        //redirection

        return res.render('home', { card, berand, error, contact: req.flash('contact') || [], Lproduct, category, user, Pproduct, Sproduct, Cproduct, req })

    }
    //اطلاعات یوزر رو بگیر و بفرس دقت کن که یوزر خریدار هست یا فروشنده
    async logIn(req, res) { //NC
        //validation
        let old = {}
        let error;
        if (req.query.status) {
            if (req.query.status == 'userNameLogin' && !req.query.userName) {
                error = 'لطفا نام کاربری را وارد کنید'
            }
            else if (req.query.status == 'phoneLogin' && !req.query.phone) {
                error = 'لطفا شماره موبایل را وارد کنید'
            }
            else if (!req.query.password) {
                old = req.query
                error = 'لطفا رمز عبور را وارد کنید'
            }

        }

        let query;
        old = req.query
        if (req.query.userName && req.query.password) {
            let user = await User.findOne({ userName: req.query.userName })
            if (user && user.password == req.query.password) {
                //set coocki
                await res.cookie('auth', { userName: req.query.userName, password: req.query.password }, { signed: true, maxAge: 9000000, httpOnly: true })
                await res.cookie('is_auth', true, { signed: true, httpOnly: true })
                return res.redirect('/')

            }
            else {
                // throw error
                error = 'نام کاربری یا رمز عبور صحیح نمی باشد!'
                req.flash('formData', old)
                return res.render('login.ejs', { error, oldData: req.flash('formData') || [] })

            }

        }
        else if (req.query.phone && req.query.password) {
            let user = await User.findOne({ phone: req.query.phone })
            if (user && user.password == req.query.password) {
                //set coocki
                await res.cookie('auth', { userName: user.userName, password: req.query.password }, { signed: true, maxAge: 9000000, httpOnly: true })
                await res.cookie('is_auth', true, { signed: true, httpOnly: true })

                return res.redirect('/')

            }
            else {
                // throw error
                error = 'شماره موبایل یا رمز عبور صحیح نمیباشد!'
                req.flash('formData', old)
                return res.render('login.ejs', { req ,error, oldData: req.flash('formData') || [] })


            }

        }
        else {
            req.flash('formData', old)
            return res.render('login.ejs', { error, oldData: req.flash('formData') || [] })

        }
    }

    async search(req, res) {

    }

    async privacy_policy(req, res) {
        res.render('privacy-policy', {req})
    }
   
    async purchase_guide(req, res) {
        res.render('purchase-guide', {req})
    } 
    
    async terms_of_service(req, res) {
        res.render('terms-of-service', {req})
    }




}
module.exports = new homeController;