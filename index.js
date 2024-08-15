const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./src/util/config')
const { connectToDatabase } = require('./src/util/db')

const blogsRouter = require('./src/controllers/blogs')
const usersRouter = require('./src/controllers/users')
const loginRouter = require('./src/controllers/login')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'SequelizeValidationError' && error.message.includes('isEmail') && error.message.includes('username')) {
        return response.status(400).send({ error: 'Given username is not a valid email address'})
    }

    next(error)
}
app.use(errorHandler)

const start = async() => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()