const { body } = require('express-validator')
const Product = require('./../../model/Product')
const path = require('path')



class sellerAdmin {

    prduct() {
        return [

            body('title')
                .isLength({ min: 5 })
                .withMessage('عنوان نمیتواند کمتر از 5 کاراکتر باشد یا خالی بماند')
                .custom(async (value, { req }) => {
                    if (req.query._method === 'put') {
                        let product = await Product.findById(req.params.id)
                        if (product.title === value) return;
                    }
                    let product = await Product.findOne({ slug: this.slug(value) })
                    if (product) {
                        throw new Error('محصولی از قبل با این عنوان وجود دارد')
                    }
                }),

            body('body')
                .isLength({ min: 20 })
                .withMessage('توضیحات کامل نیست'),

            body('price')
                .not().isEmpty()
                .withMessage('قیمت نمیتواند خالی بماند'),

            body('exsist')
                .not().isEmpty()
                .withMessage('اگر از این محصول موجود نیست نمیتوانید انرا در سایت قرار دهید'),

            body('size')
                .not().isEmpty()
                .withMessage('باید حتما اندازه محصول مشخص شود'),

            body('images')
                .custom(async (value, { req }) => {
                    if (req.query._method === 'put' && value === undefined) return;

                    if (!value)
                        throw new Error('وارد کردن تصویر الزامی است');

                    let fileExt = ['.png', '.jpg', '.jpeg'];
                    if (!fileExt.includes(path.extname(value)))
                        throw new Error('پسوند های وارد شده صحیح نیست. پسوند یا فرمت تصویر باید jpg. یا png. باشد')

                }),

            body('category')
                .not().isEmpty()
                .withMessage('دسته بندی محصول باید انتخاب شود'),
        ]
    }

    contact_us() {
        return [
            body('body').not().isEmpty().withMessage('لطفا پیام خود را وارد کنید')
        ]
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }

}
module.exports = new sellerAdmin