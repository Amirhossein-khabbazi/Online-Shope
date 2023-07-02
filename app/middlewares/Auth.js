const User = require("./../../model/User")
const Buyer = require("./../../model/buyer")


class Auth {
    async is_auth(req, res, next) {
        const user = req.signedCookies.auth
        if (!user) {
            await res.cookie('is_auth', false, { signed: true, httpOnly: true })
            return res.redirect("/404")
        }
        else {
            let temp1 = await User.findOne({ userName: user.userName, password: user.password }).select("userName password")
            let temp2 = await Buyer.findOne({ phone: user.phone, password: user.password }).select("phone password")

            if (temp1 || temp2) {
                await res.cookie('is_auth', true, { signed: true, httpOnly: true })
                if (temp1) {
                    req.user = temp1
                }
                else if (temp2) {
                    req.user = temp2
                }
                return next()
            }
            // await res.cookie('is_auth', false, { signed: true, httpOnly: true })
            // return next()
        }
        next()
    }

    async is_admin(req, res, next) {
        // return next()
        const user = req.signedCookies.auth
        if (!user) {
            await res.cookie('is_auth', false, { signed: true, httpOnly: true })
            return res.redirect("/404")
        }
        else {
            let temp = await User.findOne({ userName: user.userName, password: user.password }).select("admin")
            if (temp) {
                if (temp.admin) {
                    await res.cookie('is_admin', true, { signed: true, httpOnly: true })
                    return next()
                }
            }
            return res.redirect("/404")
        }
    }

    async getLogOut(req, res, next) {
        let authUser = req.signedCookies.is_auth
        if (authUser != 'true' && authUser != 'false') {
            res.redirect('/logout')
        }
       
        else {
            next()
        }
    }

    async is_buyer(req, res, next) {
        // return next()
        const user = req.signedCookies.auth
        if (!user) {
            await res.cookie('is_auth', false, { signed: true, httpOnly: true })
            return res.redirect("/404")
        }
        else {
            let temp = await Buyer.findOne({ phone: user.phone, password: user.password })

            if (temp) {
                if (temp.buyer) {

                    await res.cookie('is_admin', true, { signed: true, httpOnly: true })
                    return next()
                }
            }
            return res.redirect("/404")
        }
    }

    async is_seller(req, res, next) {
        // return next()
        const user = req.signedCookies.auth
        if (!user) {
            await res.cookie('is_auth', false, { signed: true, httpOnly: true })
            return res.redirect("/404")
        }
        else {
            let temp = await User.findOne({ userName: user.userName, password: user.password })
            if (temp) {
                if (temp.seller) {
                    await res.cookie('is_admin', true, { signed: true, httpOnly: true })
                    return next()
                }
            }
            return res.redirect("/404")
        }
    }

}

module.exports = new Auth()