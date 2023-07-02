const express = require('express');
const router = express.Router();

const orderController = require('./../../contrller/adminController/order')

router.get('/openorder' , orderController.openOrder)
router.get('/orderhistory' , orderController.orderHistory)
router.get('/pay/:id' , orderController.setPay)


module.exports = router;