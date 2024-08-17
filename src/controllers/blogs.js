const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')
const { DATE } = require('sequelize')

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

router.post('/', tokenExtractor, async(req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
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

router.delete('/:id', blogFinder, tokenExtractor, async(req, res) => {
    if (!req.blog) {
        res.status(404).end()
    } else if (req.blog.userId !== req.decodedToken.id) {
        res.status(401).end()
    } else {
        req.blog.destroy()
        res.status(200).end()
    }
})

module.exports = router