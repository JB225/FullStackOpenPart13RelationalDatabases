const router = require('express').Router()
const { authenticateUser } = require('../util/authUtilities')

router.delete('/', authenticateUser, async (req, res) => {
    req.session.destroy((err) => {
        if (err) next(err)
        res.status(200).send()
    })
})

module.exports = router