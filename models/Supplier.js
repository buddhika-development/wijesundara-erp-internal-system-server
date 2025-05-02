const mongoose = require('mongoose')

const SupplierSchema = new mongoose.Schema({
    supplier_name : {
        type : String,
        required : true
    },
    supplier_contact : {
        type : String,
        required : true
    },
    supplier_address_line_one : {
        type : String,
        required : true
    },
    supplier_address_line_two : {
        type : String,
        required : false
    },
    supplier_address_city : {
        type : String,
        required : true
    }
})


const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema)
module.exports = Supplier