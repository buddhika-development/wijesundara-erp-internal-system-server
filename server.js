const express = require('express')
const dotenv = require('dotenv')
const db_connection = require('./utils/db')
const stock_router = require('./routes/stock')

dotenv.config()

// configure basic app
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : false}))


// access port values
const PORT = process.env.PORT || 8080

// setup api routers
app.use('/api/stock', stock_router)

db_connection()

app.listen(PORT, ()=> {
    console.log(`Backend server running in port ${PORT}`)
})