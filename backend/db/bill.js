const mongoose = require('mongoose');
//Creating shop schemma
const billSchemma = new mongoose.Schema({
    shopid: String,
    date: String,
    amount: Number,
    clear: Boolean,
    amountleft: Number
});

module.exports = mongoose.model("bills",billSchemma);