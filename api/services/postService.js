const Post = require('../models/Post')

exports.getAllUserPosts = (userId) => {
    return Post.find({ user: userId }).exec()
}

exports.getAllPosts = () => {
    return Post.find().exec()
}

exports.createPost = (post) => {
    return Post.create(post)
}

exports.deletePost = (post) => {
    return Post.deleteOne(post)
}

exports.updatePost = (id, newPost) => {
    return Post.updateOne({ _id: id }, newPost)
}

exports.getPostById = (id) => {
    return Post.findById(id).exec()
}