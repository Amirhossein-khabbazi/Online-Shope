const express = require('express');
const router = express.Router();
const admins = require('./../../contrller/adminController/admins')
const adminValid = require('./../../validator/adminValidation')


router.get('/' , admins.index)
router.post('/remove/:id' , admins.remove)
router.get('/create' , admins.create)
router.get('/edit/:id' , admins.edit)
router.post('/create' , adminValid.handl() ,admins.create_post.bind(admins))
router.post('/edit/:id' , adminValid.handl() ,admins.edit_post.bind(admins))



module.exports = router;