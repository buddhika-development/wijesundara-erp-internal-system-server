const express = require('express')
const dotenv = require('dotenv')
const db_connection = require('./utils/db')

dotenv.config()

// configure basic app
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))


// access port values
const PORT = process.env.PORT || 8080

db_connection()

app.listen(PORT, ()=> {
    console.log(`Backend server running in port ${PORT}`)
})