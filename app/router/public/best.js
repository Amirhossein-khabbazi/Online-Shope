const express = require('express');
const router = express.Router();

const bestController = require('./../../contrller/publicController/bestController')

router.get('/' , bestController.index)
router.get('/best-single/:slug' , bestController.bestSingle)

module.exports = router;