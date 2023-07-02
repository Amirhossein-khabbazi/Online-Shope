const { body } = require('express-validator')
const Product = require('../../model/Product')
const User = require('../../model/User')
const path = require('path')
const { query } = require('express')

class adminValidation {

    handl() {
        return [
            body('name').not().isEmpty().withMessage('لطفا نام را وارد کنید'),
            body('family').not().isEmpty().withMessage('نام خانوادگی نمیتواند خالی بمانید'),
            body('userName').not().isEmpty().withMessage('نام کاربری باید وارد شود')
                .custom(async (value, { req }) => {
                    if (req.query._method === 'put') {
                        let user = await User.findById(req.params.id)
                        if (user.userName === value) return;
                    }
                    let user = await User.findOne({ userName: value })
                    if (user) {
                        throw new Error('چنین نام کاربری وجود دارد')
                    }

                })
            ,
            body('password').not().isEmpty().withMessage('رمز عبور باید وارد شود'),

            body('phone').not().isEmpty().withMessage(' شماره موبایل نمیتواند خالی باشد')
                .custom(async (value, { req }) => {
                    if (req.query._method === 'put') {
                        let user = await User.findById(req.params.id)
                        if (user.phone === value) return;
                    }
                    let user = await User.findOne({ phone: value })
                    if (user) {
                        throw new Error('چنین شماره وجود دارد')
                    }
                }),

        ]

    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }

}
module.exports = new adminValidation;