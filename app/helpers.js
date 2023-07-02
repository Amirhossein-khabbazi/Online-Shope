const path = require('path');
const autoBind = require('auto-bind');
const moment = require('moment-jalaali');
moment.loadPersian({ usePersianDigits: true })

module.exports = class Helpers {

    constructor(req, res) {
        autoBind(this);
        this.req = req;
        this.res = res;
        this.formData = req.flash('formData')[0];
    }

    getObjects() {
        return {
            date: this.date,
            req: this.req,
            price: this.price,
            set_baner : this.set_baner
            // path : this.path
        }
    }

    date(time) {
        return moment(time);
    }

    price(price) {
        let output = ""
        let help = ""
        let save = 0
        let pri = price.toString();
        let count = 0
        if (pri.length <= 3) {
            return pri
        }
        for (let i = pri.length - 1; i >= 0; i -= 1) {
            help = help + pri.charAt(i)
            count = count + 1 // 001 000 000
            if (count == 3) {
                if (i == 0) {
                    break
                }
                output = output + help
                output = output + ","
                help = ""
                count = 0
                save = i

            }
        }
        for (let i = save - 1; i >= 0; i -= 1) {
            output = output + pri.charAt(i)
        }
        help = ""
        for (let i = output.length - 1; i >= 0; i -= 1) {
            help = help + output.charAt(i)
        }

        return help
    }

    set_baner(user) {
        if (user.baner) {
            return user.baner
        }

        let rand =parseInt( Math.random() * (4 - 1) + 1);
        let src = '/assets/images/' + rand + '.jpg'
        return src
    }
}