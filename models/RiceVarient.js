const mongoose = require('mongoose')

const RiceVarientSchema = new mongoose.Schema({
    rice_type : "String"
})

const RiceVarient = mongoose.models.RiceVarient || mongoose.model('RiceVarient', RiceVarientSchema)
module.exports = RiceVarient