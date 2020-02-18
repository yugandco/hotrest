const mongoose = require('mongoose');

let hotelSchema = mongoose.Schema({
    user__id: {
        type: String
    },
    type_rooms: {
        type: String
    },
    num_rooms: {
        type: Number
    },
    num_people: {
        type: Number
    },
    num_bed: {
        type: Number
    },
    included: {
        type: String
    },
    comin_free_date: {
        type: Date
    },
    comout_free_date: {
        type: Date
    }

});

let Hotel = module.exports = mongoose.model('Hotel', hotelSchema);