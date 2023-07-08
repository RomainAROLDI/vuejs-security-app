const Like = require('../models/Like')

exports.getAllUserLikes = (userId) => {
    return Like.find({ user: userId }).exec()
}

exports.getAllPostLikes = (postId) => {
    return Like.find({ post: postId }).exec()
}

exports.createLike = (like) => {
    return Like.create(like)
}

exports.getLikeById = (id) => {
    return Like.findById(id).exec()
}

exports.isLikeExist = (idUser, idPost) => {
    return Like.exists({ user: idUser, post: idPost })
}

exports.deleteLike = (like) => {
    return Like.deleteOne(like)
}

exports.getPostLikesCount = (idPost) => {
    return Like.count({ post: idPost })
}