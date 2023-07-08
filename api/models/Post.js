const mongoose = require('mongoose')
const { Schema } = mongoose

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentsCount: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Post', postSchema)