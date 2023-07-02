const express = require('express');
const router = express.Router();

const contactController = require('../../contrller/adminController/contactUs');

router.get('/' , contactController.index)

router.post('/remove/:id' ,contactController.remove)



module.exports = router;