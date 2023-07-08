const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createUser, getUserWithPasswordByUsername } = require('./userService')

const SALT_ROUNDS = 10
const JWT_SECRET = 'falpdGaORtezfzeLjhzRTDZh'

exports.JWT_SECRET = JWT_SECRET

function hashPassword(plainTextPassword) {
    return bcrypt.hash(plainTextPassword, SALT_ROUNDS)
}

function comparePasswords(plainTextPassword, hash) {
    return bcrypt.compare(plainTextPassword, hash)
}

function createToken(data) {
    return jwt.sign({ data }, JWT_SECRET, {
        expiresIn: '1d'
    })
}

exports.signIn = async (username, password) => {
    const user = await getUserWithPasswordByUsername(username)

    if (!user || !(await comparePasswords(password, user.password))) {
        let error = new Error('Combinaison pseudo / mot de passe invalide.')
        error.status = 401
        throw error
    }

    return { token: createToken({ id: user._id, username: user.username, isAdmin: user.isAdmin }) }
}

exports.signUp = async (username, password) => {
    if (username && password) {
        const user = await createUser({ username, password: await hashPassword(password) })
        return { token: createToken({ id: user._id, username: user.username, isAdmin: user.isAdmin }) }
    } else {
        let error = new Error('Une erreur s\'est produite lors de la création de l\'utilisateur.')
        error.status = 401
        throw error
    }
}