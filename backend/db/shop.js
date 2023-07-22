const mongoose = require('mongoose');
//Creating shop schemma
const shopSchemma = new mongoose.Schema({
    name: String,
    address: String,
    mobile: String,
    route: String,
    pendingamt: Number,
});

module.exports = mongoose.model("shops",shopSchemma);