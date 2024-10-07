const express = require('express')
const session = require('express-session')
require('express-async-errors')
const app = express()

const { PORT, SECRET } = require('./src/util/config')
const { connectToDatabase, sequelize } = require('./src/util/db')

const blogsRouter = require('./src/controllers/blogs')
const usersRouter = require('./src/controllers/users')
const loginRouter = require('./src/controllers/login')
const authorRouter = require('./src/controllers/authors')
const readingListRouter = require('./src/controllers/readingList')
const logoutRouter = require('./src/controllers/logout')

var SequelizeStore = require("connect-session-sequelize")(session.Store);

app.use(express.json())

app.use(session({
    secret: SECRET,
    store: new SequelizeStore({ db: sequelize, table: 'session'}),
    resave: false,
    proxy: false,
    saveUninitialized: true
}))

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readingLists', readingListRouter)
app.use('/api/logout', logoutRouter)

const errorHandler = (error, request, response, next) => {
    if (error.name === 'SequelizeValidationError' && error.message.includes('isEmail') && error.message.includes('username')) {
        return response.status(400).send({ error: 'Given username is not a valid email address'})
    }

    if (error.name === 'SequelizeValidationError' && (error.message.includes('min') || error.message.includes('max')) && error.message.includes('year')) {
        return response.status(400).send({ error: 'Given year field is not in the valid range'})
    }

    console.error(error.message)
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