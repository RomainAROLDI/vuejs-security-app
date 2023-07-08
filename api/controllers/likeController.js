const { mongoose } = require('mongoose')
const { createLike, isLikeExist, getLikeById, deleteLike, getAllUserLikes } = require('../services/likeService')

exports.create = async (req, res) => {
    try {
        const { post, user } = req.body

        const existingLike = await isLikeExist(req.sanitize(user), req.sanitize(post))

        if (existingLike) {
            res.status(200).json({
                error: 'The user already like this post.',
                _id: existingLike._id
            })
            return
        }

        createLike({
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

        getLikeById(id)
            .then((resp) => {
                if (!resp) {
                    res.status(400).json({ error: 'Like with id ' + id + ' doesn\'t exist.' })
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

        const like = await getLikeById(id)

        if (!like) {
            res.status(400).json({ error: 'Like with id ' + id + ' doesn\'t exist.' })
            return
        }

        deleteLike(like)
            .then((resp) => res.send(resp))
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}

exports.isExist = (req, res) => {
    try {
        const { post, user } = req.body

        isLikeExist(req.sanitize(user), req.sanitize(post))
            .then((resp) => {
                res.send(resp)
            })
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}

exports.getAllByUser = (req, res) => {
    try {
        const { id } = req.params

        getAllUserLikes(id)
            .then((resp) => res.send(resp))
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}