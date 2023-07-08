const Comment = require('../models/Comment')

exports.getAllUserComments = (userId) => {
    return Comment.find({ user: userId }).exec()
}

exports.getAllPostComments = (postId) => {
    return Comment.find({ post: postId }).exec()
}

exports.createComment = (comment) => {
    return Comment.create(comment)
}

exports.getCommentById = (id) => {
    return Comment.findById(id).exec()
}

exports.deleteComment = (comment) => {
    return Comment.deleteOne(comment)
}

exports.getPostCommentsCount = (idPost) => {
    return Comment.count({ post: idPost })
}