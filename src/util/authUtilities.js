const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { User } = require('../models')

const authenticateUser = async (req, res, next) => {
    if (req.session.user) {
        const user = await User.findByPk(req.session.user.id)
        if (!user.enabled) {
            return res.status(401).json({ error: "User account currently disabled "})
        }
        next()  
    } else {
        return res.status(401).json({ error: "Session no longer valid "})
    }
}

const autheticateUserJWT = (req, res, next) => {
    const authorisation = req.get('authorization')
    console.log(authorisation)
    if (authorisation && authorisation.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorisation.substring(7), SECRET)
        } catch {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

module.exports = { authenticateUser }