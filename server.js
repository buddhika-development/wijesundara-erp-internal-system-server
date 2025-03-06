const express = require('express')
const app = express()
const PORT = 8080;

const stock_router = require('./routes/stock')

app.use('/api/stock', stock_router)

app.listen(PORT, ()=> {
    console.log(`Backend server running in port ${PORT}`)
})