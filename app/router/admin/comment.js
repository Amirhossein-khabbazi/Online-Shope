const express = require('express');
const router = express.Router();

const commentController = require('./../../contrller/adminController/commentController')

router.get('/' , commentController.index)
router.get('/promiss/:id' ,commentController.promiss)
router.post('/remove/:id' ,commentController.remove)


module.exports = router;