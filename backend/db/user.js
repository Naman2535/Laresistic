const mongoose = require('mongoose');
//creating userSchemma
const userSchemma = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

module.exports = mongoose.model("users",userSchemma);