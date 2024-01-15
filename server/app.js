
/*** IMPORT */
const express = require('express')
const cors = require('cors')

/*** INIT API */
const app = express()

const PREFIX = process.env.PREFIX || ""

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// /*** IMPORT ROUTER */
const auth_router = require('./routes/Auth')
const user_router = require('./routes/User')


/*** MAIN ROUTER */
app.get(PREFIX + '/', (req, res) => res.send(`I'm online. All is OK ! `))

app.use(PREFIX + '/', auth_router)
app.use(PREFIX + '/users', user_router)

app.all('*', (req, res) => res.status(501).send('What the hell are you doing !?!'))

/*** Export for server and Test */
module.exports = app