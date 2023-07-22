const mongoose = require('mongoose');
//creating paymentSchemma
const paymentSchemma = new mongoose.Schema({
    shopid: String,
    billid: String,
    amount: Number,
    billdate: String,
    billamt: Number,
    date: String,
    mode: String
});

module.exports = mongoose.model("payments",paymentSchemma);