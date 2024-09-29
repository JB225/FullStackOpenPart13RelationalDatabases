const { ReadingList } = require('../models')
const router = require('express').Router()
const { tokenExtractor } = require('../util/tokenUtilities')

router.post('/', async (req, res) => {
    const readingListItem = await ReadingList.create(req.body)
    res.json(readingListItem)
})

router.put('/:id', tokenExtractor, async(req, res) => {
    const reading = await ReadingList.findByPk(req.params.id)
    if (reading.userId === req.decodedToken.id) {
        reading.read = req.body.read
        reading.save()
        res.json(reading)
    } else {
        res.status(401).send({
            message: 'Users can only mark items in their own reading lists as read or unread'
        })
    }
})

module.exports = router