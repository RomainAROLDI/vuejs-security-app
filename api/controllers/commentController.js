const {
    getAllPostComments,
    createComment,
    getAllUserComments,
    getCommentById,
    deleteComment
} = require('../services/commentService')
const { mongoose } = require('mongoose')
const { getPostById } = require('../services/postService')
const { getUserById } = require('../services/userService')

exports.getAllByPost = async (req, res) => {
    try {
        const { id } = req.params

        const post = await getPostById(id)

        if (!post) {
            res.status(400).json({ error: 'Post with id ' + id + ' doesn\'t exist.' })
            return
        }

        getAllPostComments(id)
            .then(async (resp) => {
                for (const datum of resp) {
                    datum.user = await getUserById(datum.user)
                }
                res.send(resp)
            })
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}

exports.getAllByUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await getUserById(id)

        if (!user) {
            res.status(400).json({ error: 'User with id ' + id + ' doesn\'t exist.' })
            return
        }

        getAllUserComments(id)
            .then((resp) => res.send(resp))
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}

exports.create = (req, res) => {
    try {
        const { message, likes, post, user } = req.body

        createComment({
            message: req.sanitize(message),
            likes: req.sanitize(likes) ?? 0,
            post: new mongoose.Types.ObjectId(req.sanitize(post)),
            user: new mongoose.Types.ObjectId(req.sanitize(user))
        })
            .then((resp) => res.send(resp))
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}

exports.getById = (req, res) => {
    try {
        const { id } = req.params

        getCommentById(id)
            .then((resp) => {
                if (!resp) {
                    res.status(400).json({ error: 'Comment with id ' + id + ' doesn\'t exist.' })
                    return
                }
                res.send(resp)
            })
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params

        const comment = await getCommentById(id)

        if (!comment) {
            res.status(400).json({ error: 'Comment with id ' + id + ' doesn\'t exist.' })
            return
        }

        deleteComment(comment)
            .then((resp) => res.send(resp))
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}