var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    name: String,
    access_token: String,
    token_type: String,
    id_token: String,
    expiry_date: Date,
    code: String
});

module.exports = mongoose.model("users", userSchema);