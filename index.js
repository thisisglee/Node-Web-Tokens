const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')

//Import routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

//connect to db
dotenv.config()
mongoose.connect(process.env.DB_CONNECT,
    { useUnifiedTopology: true , useNewUrlParser: true },
    ()=> console.log('Connected to DB'))

// Middlewares

//body parser
app.use(express.json())
//route middleware
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)


app.listen(3000, () => console.log('Server is started at 3000'))