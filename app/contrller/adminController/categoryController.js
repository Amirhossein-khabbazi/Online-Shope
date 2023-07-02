const Cate = require('../../../model/category');
const { validationResult } = require('express-validator');


class index {
    async index(req, res) {
        let status = 0;
        let category = await Cate.find({father : true})

        return res.render('admin/category/home', { category , status })
    }

    async goIn(req , res){
        let status = 1;
        let page = req.query.page || 1;
        let cate = await Cate.findById(req.params.id).populate('chiled')
        if(!cate){
            req.flash("errors" , [{msg: "دسته یافت نشد"}])
            return res.redirect('/')
        }
        let category = cate.chiled
        return res.render('admin/category/home', { category , status })
        
    }
    

    async create(req, res) {
        let categorise = await Cate.find({})
        res.render('admin/category/create', {categorise, errors: req.flash("errors") || [] })
    }

    async create_post(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("errors", errors.errors)
            return res.redirect(req.header("Referer") || "/");
        }

        let cat = await Cate.findOne({ title: req.body.title })
        if (cat) {
            req.flash("errors", [{ msg: "چنین دسته ای وجود دارد" }])
            return res.redirect(req.header("Referer") || "/");
        }

        if (req.body.father == 'true') {
            let categori = await Cate.create({
                title: req.body.title,
                father: true,
                slug : this.slug(req.body.title)
            })
        } else {
            let categori = await Cate.create({
                title: req.body.title,
                father: false,
                slug : this.slug(req.body.title)
            })
            await Cate.updateOne({ _id: req.body.fatherCategori }, { "$push": { "chiled": categori.id } })
        }
        return res.redirect('/admin/categorys')


    }

    async remove(req, res) {

        let cate = await Cate.findById(req.params.id).populate('chiled')
        if(!cate){
            req.flash("errors" , [{msg : "دسته وجود ندارد"}])
            return res.redirect('/')
        }
        let chiled = cate.chiled
        // let chiledDelet = this

        if(chiled){
            for(let i in chiled){
                this.chiledDel(chiled[i].id);
            }
        }

        cate.remove()
        
        return res.redirect(req.header("Referer") || "/");             


    }
    
    async chiledDel(id){
        let cate = await Cate.findById(id).populate('chiled')
        let chileds = cate.chiled
        if(chileds.length == 0){
            return cate.remove()
        }
        else{
            for(let i in chileds){
                this.chiledDel(chileds[i].id)
            }
            return cate.remove()
        }

    }

    async go(req , res){
        for(let i=16 ; i<=30 ; i++){
            Cate.create({
                title : "دسته" + i,
                father : true
            })
        }
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }


}
module.exports = new index