const path = require('path');
const moment = require('moment-jalaali');
moment.loadPersian({usePersianDigits: true})

module.exports = class Helpers {
    
    constructor(req , res) {
        this.req = req;
        this.res = res;
        this.formData = req.flash('formData')[0];
    }

   

    old(field , defaultValue = '') {
        return this.formData && this.formData.hasOwnProperty(field) ? this.formData[field] : defaultValue;
    }

   
}