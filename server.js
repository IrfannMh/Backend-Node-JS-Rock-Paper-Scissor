const express = require('express')
const session = require('express-session')
const cors = require('cors')
const morgan = require('morgan')
const {SESSION_SECRET = "KUNCI"} = process.env
const router = require("./router")
const app = express()

const {PORT = 3000} = process.env;

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure:false,
            maxAge:24000000,
        },
    })
);

app.use(morgan("dev"))
app.use(cors())

app.use(express.json()); // handle application/json request
app.use(express.urlencoded({ extended: true })); // handle application/x-www-urlencoded request

app.use(router)
app.listen(PORT, () => 
    console.log(`Listening on port ${PORT}`)
    )