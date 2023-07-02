const express = require('express');
const router = express.Router();
const auth = require('./../../middlewares/Auth')


const index = require('./../../contrller/adminController/index')
const product = require('./product')
const user = require('./user')
const cate = require('./category')
const comment = require('./comment')
const message = require('./message')
const contactUs = require('./contactUs')
const order = require('./order')
const admins = require('./admins')
//shoud be enable



router.use(auth.is_auth)
router.use(auth.is_admin)



router.get('/' , index.index)



//redirections
router.use('/products' , product)
router.use('/categorys' , cate)
router.use('/users' , user)
router.use('/comment' , comment)
router.use('/message' , message)
router.use('/contact' , contactUs)
router.use('/order' , order)
router.use('/admins' , admins)




module.exports = router;