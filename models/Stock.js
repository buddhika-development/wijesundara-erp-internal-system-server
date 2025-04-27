const mongoose = require('mongoose')

const StockSchema = new mongoose.Schema({
    rice_varient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "RiceVarient",
        required : true
    },
    stock_amount : {
        type : Number,
        required : true
    },
    stock_status : {
        type : String,
        require : true
    },
    stock_premise : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Infrastructure",
        required : true
    },
    last_updated_date : {
        type : Date,
        required : true
    }
})

const Stock = mongoose.models.Stock || mongoose.model('Stock', StockSchema)

module.exports = Stock