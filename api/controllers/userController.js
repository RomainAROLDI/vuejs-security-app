const { signIn, signUp } = require('../services/authService')

exports.signIn = (req, res) => {
    try {
        const { username, password } = req.body

        signIn(req.sanitize(username), req.sanitize(password))
            .then((resp) => res.send(resp))
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}

exports.signUp = (req, res) => {
    try {
        const { username, password } = req.body

        signUp(req.sanitize(username), req.sanitize(password))
            .then((resp) => res.send(resp))
            .catch(e => res.status(e.status ?? 500).json({ error: e.message }))
    } catch (e) {
        res.status(e.status ?? 500).json({ error: e.message })
    }
}