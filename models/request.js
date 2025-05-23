const mongoose = require('mongoose');

const requests = new mongoose.Schema({
    sec_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    bankAccount: {
        type: String,
        required: true 
    },
    date: {
        type: Date,
        required: true 
    }
});

const sections = new mongoose.Schema({
    sec_id: {
        type: String,
        ref: "request"
    },
    depname: {
        type: String,
        required: true 
    }
});
const banks = new mongoose.Schema({
    bank_id: {
        type: String,
        ref: "request"
    },
    bname: {
        type: String,
        required: true 
    },
    Bamount: {
        type: Number,
        required: true 
    },
   
});

const totals = new mongoose.Schema({
    total:{
        type:Number,
        required: true 
    }
});

const pendings = new mongoose.Schema({
    sec_id: {
        type: String,
        ref: "request"
    },
    amount: {
        type: Number,
        required: true 
    },
    description: {
        type: String,
        required: true 
    },
    date: {
        type: String,
        required: true 
    }
});

const bank = mongoose.models.request || mongoose.model('bank', banks, "bank");
const pending = mongoose.models.request || mongoose.model('pending', pendings, "pending");
const request = mongoose.models.request || mongoose.model('request', requests, "All");
const section = mongoose.models.section || mongoose.model('section', sections, "sections");
const total = mongoose.models.section || mongoose.model('total', totals, "totals");



module.exports = { request, section ,pending,bank,total};
