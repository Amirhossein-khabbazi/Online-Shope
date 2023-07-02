const express = require('express');
const router = express.Router();
const productValidator = require('./../../validator/productValidation')
const productController = require('./../../contrller/adminController/productController')
const upload = require('./../../helper/upload')
let convertFileToField = require('./../../middlewares/convertFileToField')

router.get('/', productController.index)
router.get('/create', productController.creat)

router.post('/create', upload.single('images'),
    convertFileToField.handle,
    productValidator.handl(),
    productController.create_post.bind(productController))

router.get('/edit/:id', productController.edit)

router.post('/edit/:id',
    upload.single('images'),
    convertFileToField.handle,
    productValidator.handl(),
    productController.edit_post.bind(productController))


router.post('/promiss/:id', productController.promis)
router.post('/dispromiss/:id', productController.disPromis)
router.post('/remove/:id', productController.remove)



module.exports = router;