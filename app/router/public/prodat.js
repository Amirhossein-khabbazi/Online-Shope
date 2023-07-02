const express = require('express');
const router = express.Router();
const prodatController = require('./../../contrller/publicController/prodatControler')
const commentController = require('./../../contrller/publicController/commentController')


router.get('/:slug' , prodatController.index)
router.post('/like/:slug' , prodatController.like)
router.post('/dislike/:slug' , prodatController.disLike)
router.post('/getorder/:slug' , prodatController.getOrder)

router.post('/create/:id' , commentController.create)



module.exports =  router;