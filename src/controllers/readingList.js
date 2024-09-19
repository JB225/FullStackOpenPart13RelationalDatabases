const { ReadingList } = require('../models')
const router = require('express').Router()

router.post('/', async (req, res) => {
    const readingListItem = await ReadingList.create(req.body)
    res.json(readingListItem)
})

module.exports = router