const mongoose = require('mongoose');

let restSchema = mongoose.Schema({
    user__id: String,
    type_client: String,
    num_people: Number,
    comin_date: Date
});

let Rest = module.exports = mongoose.model('Rest', restSchema);