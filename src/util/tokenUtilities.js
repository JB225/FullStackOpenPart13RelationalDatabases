const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const tokenExtractor = (req, res, next) => {
    const authorisation = req.get('authorization')
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

module.exports = { tokenExtractor }