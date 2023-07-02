const express = require('express');
const router = express.Router();

const cateController = require('./../../contrller/adminController/categoryController')
const gategoryValidator = require('./../../validator/category')

router.get('/' , cateController.index)
router.get('/create' , cateController.create)
router.post('/create' ,gategoryValidator.handl(), cateController.create_post.bind(cateController))
router.get('/goin/:id' , cateController.goIn)
router.get('/remove/:id' , cateController.remove.bind(cateController))

router.get('/go' , cateController.go)


module.exports = router;