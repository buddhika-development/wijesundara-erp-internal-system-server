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


const request = mongoose.models.request || mongoose.model('request', requests, "All");
const section = mongoose.models.section || mongoose.model('section', sections, "sections");


module.exports = { request, section };
