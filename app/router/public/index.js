const express = require('express');
const router = express.Router();
const homeController = require('./../../contrller/publicController/homeController')
const getLogOut = require('./../../middlewares/Auth')
const shop = require('./shop')
const best = require('./best')
const logInValidatior = require('./../../validator/userValidation')
const prodat = require('./prodat')
const brand = require('./../../contrller/publicController/brandController')
const contact = require('./../../contrller/publicController/contactUsController')

router.get('/', getLogOut.getLogOut, homeController.index)
router.get('/login', homeController.logIn)
router.get('/contact-us', contact.contactUs)
router.post('/contact-us', contact.contactUs_post)
router.post('/contact_request' , contact.contact_request)
router.get('/terms_of_service' , homeController.terms_of_service)
router.get('/purchase_guide' , homeController.purchase_guide)
router.get('/privacy_policy' , homeController.privacy_policy)

//___________________________________________________________________________________
router.get('/404', (req, res) => {
    res.render('404')
})

router.get('/logout', async (req, res) => {
    await res.clearCookie('auth')
    await res.cookie('is_auth', false, { signed: false, httpOnly: true })
    return res.redirect("/");
})
//___________________________________________________________________________________
router.get('/brand' , brand.index)
router.use('/shop', shop)
router.use('/product_details', prodat)
router.use('/best', best)




module.exports = router;