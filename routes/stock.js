const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        'message' : 'Index api endpoint of stock router'
    })
})

module.exports = router