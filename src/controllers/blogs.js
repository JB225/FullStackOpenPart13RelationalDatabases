const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { DATE } = require('sequelize')
const { authenticateUser } = require('../util/authUtilities')

router.get('/', async(req, res) => {
    let where = {}
    if (req.query.search) {
        where = {
            [Op.or]: [
                { title: { [Op.iLike]: "%" + req.query.search + "%" } },
                { author: { [Op.iLike]: "%" + req.query.search + "%" } }
            ]
        }
    }

    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        }, 
        where,
        order: [
            ['likes', 'DESC']
        ]
    })
    res.json(blogs)
})

router.post('/', authenticateUser, async(req, res) => {
    const user = await User.findByPk(req.session.user.id)
    const blog = await Blog.create({ ...req.body, userId: user.id, date: new DATE() })
    res.json(blog)
})

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.put('/:id', blogFinder, async(req, res) => {
    if (req.blog && res.body.likes) {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', blogFinder, authenticateUser, async(req, res) => {
    if (!req.blog) {
        res.status(404).end()
    } else if (req.blog.userId !== req.session.user.id) {
        res.status(401).end()
    } else {
        req.blog.destroy()
        res.status(200).end()
    }
})

module.exports = router