const { verify } = require('jsonwebtoken')
const { JWT_SECRET } = require('../services/authService')
const { getUserById } = require('../services/userService')

exports.isUserLogged = async (req, res, next) => {
    if (req.headers && req.headers) {
        const [scheme, token] = req.headers.authorization.split(' ')
        verify(token, JWT_SECRET, async (err, decode) => {
            if (err) {
                res.status(401).json({ error: 'NOT AUTHORIZED' })
            } else {
                req.user = await getUserById(decode.data._id)
                next()
            }
        })
    } else {
        res.status(401).json({ error: 'NOT AUTHORIZED' })
    }
}