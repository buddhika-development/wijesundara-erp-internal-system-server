const mongoose = require('mongoose')

const BidSchema = new mongoose.Schema({
    supplier_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Supplier',
        required : true
    },
    placed_date:{
        type : Date,
    },
    rice_varient : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "RiceVarient",
        required : true
    },
    bid_price : {
        type : Number,
        required : true
    }
})


const Bid = mongoose.models.Bid || mongoose.model('Bid', BidSchema)
module.exports = Bid