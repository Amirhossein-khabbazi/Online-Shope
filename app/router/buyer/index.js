const express = require('express');
const router = express.Router();
const auth = require('./../../middlewares/Auth')
const buyerController = require('./../../contrller/buyer/buyerController')
const productValidation = require('./../../validator/sellerAdmin')

router.get('/buyerLogIn' , buyerController.logIn)
router.get('/buyerSineIn' , buyerController.sineIn)

router.use(auth.is_auth)
router.use(auth.is_buyer)


router.get('/orderInvoice/:id', buyerController.orderInvoice)

router.get('/' , buyerController.index)
// router.get('/dashbordTwo' , buyerController.dashbordTwo)
router.post('/addToCard' , buyerController.addToCard)
router.post('/removeFromCard/:id' , buyerController.removeFromCard)
router.get('/removeFromCard/:id' , buyerController.removeFromCard)
router.get('/fillShop' , buyerController.fillShop)
router.get('/contact-us', buyerController.contactUs)
router.post('/contact-us',productValidation.contact_us(), buyerController.contactUs_post)
router.post('/checkPassword', buyerController.checkPassword)
router.post('/updateUserAccount', buyerController.updateUserAccount)

router.get('/card' , buyerController.card)
router.post('/upgradeCard' , buyerController.upgradeCard)


router.get('/paymentChecker' , buyerController.paymentChecker)



module.exports = router;