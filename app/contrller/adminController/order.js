const Order = require('./../../../model/order')
const OrderHistory = require('./../../../model/orderHistory')
const Controller = require('../controller')

class order extends Controller {

    async openOrder(req, res) {
        let page = req.query.page || 1
        let order = await Order.paginate({}, { page, populate : 'seller user product' ,sort: { createdAt: -1 }, limit: 20 })
        res.render('admin/order/order', { order })
    }
    async orderHistory(req, res) {
        let user = await this.getUser(req , res)
        let page = req.query.page || 1
        let orderHistory = await OrderHistory.paginate({}, { page, populate :['buyer','seller','product'] ,sort: { createdAt: -1 }, limit: 20 })
        res.render('admin/order/orderHistory', { orderHistory , user})
    }

    async setPay(req , res){
        await OrderHistory.updateOne(
            {_id : req.params.id},
            {pay : true}
        )
        res.redirect('/admin/order/orderhistory')
    }




}
module.exports = new order
