const express = require('express');
const router = express.Router();

const meesageController = require('./../../contrller/adminController/meesageController');
const messageValidation = require('./../../validator/messageValidation');

router.get('/' , meesageController.index)
router.get('/create' ,meesageController.create)
router.get('/edite/:id' ,meesageController.edite)
router.post('/remove/:id' ,meesageController.remove)
router.post('/create', messageValidation.handl() ,meesageController.create_post)
router.post('/edite/:id', messageValidation.handl() ,meesageController.edite_post)


module.exports = router;