const User = require('./../../../model/User')
const Controller = require('../controller')

class index extends Controller{

    async index(req , res){
        let user = await this.getUser(req , res)
        res.render('admin/index' , {user})
    }

    async

    


}
module.exports = new index
