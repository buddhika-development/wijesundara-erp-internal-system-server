const mongoose = require('mongoose')

const PurchaseSchema = new mongoose.Schema({
    supplier_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Supplier",
        required : true
    },
    rice_varient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "RiceVarient",
        required : true
    },
    stock_amount : {
        type : Number,
        required : true
    },
    purchase_date : {
        type : Date,
        required : true
    },
    purchase_status : {
        type : String,
        required :true
    }
})


const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema)
module.exports = Purchase