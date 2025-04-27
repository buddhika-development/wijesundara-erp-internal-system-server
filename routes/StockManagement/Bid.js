const express = require('express')
const Bid = require('../../models/Bid')
const router = express.Router()

router.get('/', async (req, res) => {
    const bids = await Bid.find()
    res.status(200).json(bids)
})

module.exports = router