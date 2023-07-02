const {body} = require('express-validator')



class categpry{

    handl(){
        return [
            body('title').not().isEmpty().withMessage('عنوان دسته نمیتواند خالی بماند'),
        ]
    }

}
module.exports = new categpry