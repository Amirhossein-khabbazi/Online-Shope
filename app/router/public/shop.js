const express = require('express');
const router = express.Router();
const shopController = require('./../../contrller/publicController/shopController')

router.get('/' , shopController.index)
router.get('/:id' , shopController.index)





module.exports = router;