const {
    getAllUserPosts,
    createPost,
    getPostById,
    updatePost,
    getAllPosts, deletePost
} = require('../services/postService')
const { mongoose } = require('mongoose')
const { getUserById } = require('../services/userService')
const { getPostCommentsCount } = require('../services/commentService')
const { getPostLikesCount } = require('../services/likeService')

exports.getAll = (req, res) => {
    try {
        getAllPosts()
            .then(async (resp) => {
                for (const datum of resp) {
                    datum.user = await getUserById(datum.user)
                    datum.commentsCount = await getPostCommentsCount(datum._id)
                    datum.likes = await getPostLikesCount(datum._id)
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

        getAllUserPosts(id)
            .then((resp) => res.send(resp))
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}

exports.create = (req, res) => {
    try {
        const { title, description, likes, user } = req.body

        createPost({
            title: req.sanitize(title),
            description: req.sanitize(description),
            likes: req.sanitize(likes) ?? 0,
            user: new mongoose.Types.ObjectId(req.sanitize(user))
        })
            .then((resp) => res.send(resp))
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, likes, user } = req.body

        const existingPost = await getPostById(id)

        if (!existingPost) {
            res.status(400).json({ error: 'Post with id ' + id + ' doesn\'t exist.' })
            return
        }

        updatePost(id, {
            title: req.sanitize(title) ?? existingPost.title,
            description: req.sanitize(description) ?? existingPost.description,
            likes: req.sanitize(likes) ?? existingPost.likes,
            user: req.sanitize(user) ? new mongoose.Types.ObjectId(user) : existingPost.user
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

        getPostById(id)
            .then(async (resp) => {
                if (!resp) {
                    res.status(400).json({ error: 'Post with id ' + id + ' doesn\'t exist.' })
                    return
                }
                resp.user = await getUserById(resp.user)
                resp.commentsCount = await getPostCommentsCount(id)
                resp.likes = await getPostLikesCount(id)
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

        const post = await getPostById(id)

        if (!post) {
            res.status(400).json({ error: 'Post with id ' + id + ' doesn\'t exist.' })
            return
        }

        deletePost(post)
            .then((resp) => res.send(resp))
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}