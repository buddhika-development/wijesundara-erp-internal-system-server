const express = require('express')
const dotenv = require('dotenv')

// configure basic app
const app = express()
dotenv.config()

// access port values
const PORT = process.env.PORT || 8080

// setup api routers
const stock_router = require('./routes/stock')

app.use('/api/stock', stock_router)

app.listen(PORT, ()=> {
    console.log(`Backend server running in port ${PORT}`)
})