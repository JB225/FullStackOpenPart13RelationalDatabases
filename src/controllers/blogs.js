const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async(req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

router.post('/', async(req, res) => {
     const blog = await Blog.create(req.body)
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

router.delete('/:id', async(req, res) => {
    if (req.blog) {
        req.blog.destroy()
        res.status(200).end()
    } else {
        res.status(404).end()
    }
})

module.exports = router