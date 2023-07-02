const express = require('express');
const productController = require('../../contrller/adminController/productController');
const router = express.Router();
const panelController = require('../../contrller/sellerAdminController/sellerPanelController')
const auth = require('./../../middlewares/Auth')
const productValidation = require('./../../validator/sellerAdmin')
const convertFileToField = require('./../../middlewares/convertFileToField')
const upload = require('./../../helper/upload')



router.use(auth.is_auth)
router.get('/orderInvoice/:id', panelController.orderInvoice)

router.use(auth.is_seller)

router.get('/orderInvoice/:id', panelController.orderInvoice)

router.get('/', panelController.dashbordOne)
router.get('/dashbordTwo', panelController.dashbordTwo)
router.get('/dashbordThree', panelController.dashbordTree)
router.get('/addProduct', panelController.creatPro)
router.post('/addProduct', upload.single('images'),convertFileToField.handle, productValidation.prduct(), panelController.creatPro_post.bind(productController))
router.get('/edit/:id', panelController.editPro)
router.post('/edit/:id', upload.single('images'), convertFileToField.handle, productValidation.prduct(),panelController.editPro_post.bind(panelController))
router.get('/contact-us', panelController.contactUs)
router.post('/contact-us',productValidation.contact_us(), panelController.contactUs_post)
router.post('/remove/:id', panelController.removeProduct)
router.post('/removeOrder/:id', panelController.removeOrder)
router.get('/soledOrder/:id', panelController.soledOrder)
router.get('/comments/:id' , panelController.showComments)
router.post('/comments' , panelController.answerComment)
router.get('/acountSetting' , panelController.accountSettingPage)
router.post('/acountSetting' , panelController.accountSetting)
router.post('/checkUserName' , panelController.checkUserName)
router.get('/closeOrder/:id' , panelController.closeOrder)



module.exports = router;