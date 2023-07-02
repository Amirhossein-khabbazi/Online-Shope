const autoBind = require('auto-bind');
const User = require('./../../model/User')
const Buyer = require('./../../model/buyer')
const Card = require('./../../model/card')
const OrderHistory = require('./../../model/orderHistory')
const Message = require('./../../model/message');
const { find } = require('./../../model/User');
const Product = require('./../../model/Product');
const { promis } = require('./adminController/productController');


module.exports = class controller {
    constructor() {
        autoBind(this);
    }

    async is_auth(req, res) {
        try {
            let t = req.signedCookies.is_auth;
            return t
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async userType(req, res) {
        try {
            let t = await this.is_auth(req, res)
            if (t == 'false') {
                return 'false'
            }

            let user = await this.getUser(req, res)
            if (user.seller) {
                return 'seller'
            }
            else if (user.buyer) {
                return 'buyer'
            }
            else {
                return 'admin'
            }
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async getUser(req, res) {
        try {
            const user = req.signedCookies.auth;
            let seller = await User.find(user)
            if (seller.length != 0) {
                return seller[0]
            }
            let buyer = await Buyer.find(user)
            if (buyer.length != 0) {
                return buyer[0]
            }
            else{
                return false
            }

            //----------------------------------------------
            // const user = req.signedCookies.auth;
            // let loginedUse = await User.find(user)
            // if (!loginedUse[0]) {
            //     res.redirect('/login')
            // }
            // return loginedUse[0];
        } catch (error) {
            res.send("مشکلی پیش آمده  لطفا سریعتر این مشکل را گزارش دهید" + error)
        }

    }

    async getBuyer(req, res) {
        const user = req.signedCookies.auth;
        let loginedUse = await Buyer.find(user)
        if (!loginedUse[0]) {
            res.redirect('/login')
        }
        return loginedUse[0]
    }

    async getLeast(req, res, Model, number = 4) {
        let model = [];

        if (Model.length <= number) {
            return Model;
        }
        else {
            for (let i = 0; i < number; i++) {
                model[i] = Model[i]
            }
        }
        return model;

    }

    fromDel(num = 1) {
        let del = num
        return del
    }

    async cateMatch(cate, product, req) {
        let result = [];
        product.forEach(pro => {
            cate.forEach(cat => {
                if (pro.category.indexOf(cat) != -1) {
                    if (result.indexOf(pro) == -1)
                        result.push(pro);
                }
            })
        })
        return result;
    }

    async getMessage(seller) {
        let message = await Message.find({}).populate('admin')
        let fmessage = [], x
        for (let i = 0; i < message.length; i++) {
            if (message[i].type == 1 || message[i].user == seller) {
                fmessage.push(message[i])
                x++;
            }
        }
        return fmessage
    }

    async setError(req, res, err, flash, redir) {
        req.flash(flash, err)
        return res.redirect(redir)
    }
    //////////////////////////////// CARD //////////////////////////////////////////////////////////////////
    async computePrice(req, res, user) { // 
        let cardPrice = []

        let card = await Card.find({ buyer: user.id }).populate('pro')
        for (let i = 0; i < card.length; i++) {
            if (card[i].pro.exsist >= card[i].count) {
                let taxation = parseInt((card[i].pro.price / 100) * 9.3)
                taxation = card[i].pro.price + taxation
                await cardPrice.push((taxation * parseInt(card[i].count)))
            }
        }
        let resu = 0
        for (let j in cardPrice) {
            resu += cardPrice[j]
        }
        return resu


    }

    async isInCard(req, res, user, product) { //

        if (user.buyer) {
            let pro = await Card.findOne({ pro: product.id, buyer: user.id })
            if (pro) {
                return true
            }
            else {
                return false
            }
        }
        return true
    }

    async getCard(req, res, id) {

        let card = await Card.find({ buyer: id }).populate('pro')
        // let card = await Buyer.findById(id).populate('card.pro');
        return card;
    }

    async Qcard(req, res) {
        let user = await this.getUser(req, res)
        let card = ''
        if (user) {
            card = await this.getCard(res, req, user.id)
        } 
        let total = await this.computePrice(req, res, user)
        let t = await this.is_auth(req, res)
        let type = await this.userType(req, res)

        if (card == '' || t == 'false' || type != 'buyer') {
            card = ''
            total = ''
            return { 'card': card, 'total': total, type: type }
        }
        return { 'card': card, 'total': total, type: type }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async redirectWrongUser(req, res, type) {
        let user = await this.userType(req, res)
        if (user != type) {
            return res.redirect('/404')
        }
        else {
            return res.redirect('/')
        }
    }

    async followCode(req, res) {
        let code = await Math.floor(Math.random() * 1000000000000);
        while (true) {
            let history = await OrderHistory.findOne({ code: code })
            if (!history) {
                break;
            }
            else {
                code = await Math.floor(Math.random() * 10000000000);
            }
        }

        return code
    }



}