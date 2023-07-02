const express = require('express');
const router = express.Router();
const admintRouter = require('./admin/index')
const sellerPanel = require('./sellerPanel/index')
const public = require('./public/index')
const buyer = require('./buyer/index')
const User = require('./../../model/User')
const Buyer = require('./../../model/buyer')

router.use((req, res, next) => {
    res.locals.is_auth = req.signedCookies.is_auth
    res.locals.is_admin = req.signedCookies.is_admin
    next()
})
//...............................................................



//...............................................................

router.get('/checkUser',async (req, res) => {
    const user = req.signedCookies.auth;
    let seller = await User.find(user)
    if(seller != 0){
        res.redirect('/sellerPanel')
    }
    let buyer = await Buyer.find(user)
    // console.log(seller.length);
    if(buyer.length != 0){
        res.redirect('/buyer')
    }
})
//redirection
router.use('/admin', admintRouter)
router.use('/sellerPanel', sellerPanel)
router.use('/buyer', buyer)
router.use('/', public)

router.all('*' , (req , res) =>{
    res.render('404')
})


module.exports = router;