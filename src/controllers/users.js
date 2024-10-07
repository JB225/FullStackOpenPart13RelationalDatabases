const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: {exclude: ['userId']}
        }
    })
    res.json(users)
})

router.get('/:id', async (req, res) => {
    var whereRead = {}
    if (req.query.read) {
        whereRead = {'read' : req.query.read}
    }
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'password'] },
        include: [{
            model: Blog,
            as: 'read_blogs',
            attributes: {exclude: ['userId', 'createdAt', 'updatedAt']},
            through: {
                attributes: ['read', 'id'],
                where: whereRead
            },
        }]
    })
    res.json(user)
})

router.post('/', async (req, res) => {
    const {username, name, password} = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
        username, name, password: passwordHash
    })
    res.json(user)
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })
    user.username = req.body.username
    await user.save()

    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

module.exports = router