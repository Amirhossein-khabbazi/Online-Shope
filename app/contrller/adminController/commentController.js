const Comment = require('../../../model/comment')
class commentController {

    async index(req, res) {
        let page = req.query.page || 1
        let comment = await Comment.paginate({}, { page, populate: 'product', sort: { createdAt: -1 }, limit: 12 })
        res.render('admin/comments/comment', { comment })
    }

    async remove(req, res) {
        let comment = await Comment.findById(req.params.id).populate('child')
        if(comment.child){
            comment.child.remove()
        }
        comment.remove()
        res.redirect('/admin/comment')

    }

    async promiss(req, res) {
        let comment = await Comment.findById(req.params.id)
        if (comment.permission) {
            await Comment.updateOne(
                { _id: req.params.id },
                { permission: false }
            )

        } else {
            await Comment.updateOne(
                { _id: req.params.id },
                { permission: true }
            )
        }

        res.redirect('/admin/comment')


    }



}
module.exports = new commentController
