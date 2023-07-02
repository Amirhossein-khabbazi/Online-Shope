const {body} = require('express-validator')



class messageValidation{

    handl(){
        return [
            body('topic').not().isEmpty().withMessage('عنوان پیام نمیتواند خالی بماند'),
            body('body').not().isEmpty().withMessage('متن پیام نمیتواند خالی بماند'),
        ]
    }

}
module.exports = new messageValidation