const express = require('express');
const router = express.Router();
const upload = require('./../../helper/upload')
const userUpload = require('./../../helper/userUpload')
const convertFileToField = require('./../../middlewares/convertFileToField')

const userController = require('./../../contrller/adminController/userController')
const userValidator = require('./../../validator/userValidation')

router.get('/' , userController.index)
router.post('/remove/:id' , userController.remove)
router.get('/create' , userController.create)
router.post('/create' , userUpload.single('logo') ,convertFileToField.handle ,userValidator.handl(), userController.create_post.bind(userController))

router.get('/edit/:id' , userController.edit)
router.get('/ban/:id' , userController.ban)
router.get('/setFree/:id' , userController.setFree)
router.post('/edit/:id'  ,userUpload.single('logo') ,convertFileToField.handle ,userValidator.handl(), userController.edit_post)
router.post('/baner/:id' ,userUpload.single('baner') ,convertFileToField.handle , userController.addBaner)



module.exports = router;