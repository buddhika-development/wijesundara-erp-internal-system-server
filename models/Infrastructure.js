const mongoose = require('mongoose')

const InfrastructureSchema = new mongoose.Schema({
    infrastructure_name : {
        type : "String",
        required : true
    },
    infrastructure_type : {
        type : "String",
        required : true
    },
    infrastructure_address_line_one : {
        type : "String",
        required : true
    },
    infrastructure_address_line_two : {
        type : "String"
    },
    infrastructure_address_district : {
        type : "String",
        required : true
    },
    infrastructure_address_city : {
        type : "String",
        required : true
    },
    contact_number : {
        type : String,
        required : true
    }
})

const Infrastructure = mongoose.models.Infrastructure || mongoose.model('Infrastructure', InfrastructureSchema)

module.exports = Infrastructure