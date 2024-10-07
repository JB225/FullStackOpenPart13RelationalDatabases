const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')
const HOUR = 3600000

router.post('/', async(req, res) => {
    const user = await User.findOne({
        where: { username: req.body.username }
    })

    if (!user.enabled) {
        return res.status(401).json({
            error: 'user account currently disabled'
        })
    }

    const passwordCorrect = user === null 
        ? false : await bcrypt.compare(req.body.password, user.password) 

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    } 

    req.session.regenerate(() => {
        req.session.cookie.expires = new Date(Date.now() + HOUR)
        req.session.user = { id: user.id, username: user.username }
        req.session.save(() => {
            res.status(200).send({ username: user.username, name: user.name })
        })
    })
})

module.exports = router