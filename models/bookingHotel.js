const mongoose = require('mongoose');

let bookingHotelSchema = mongoose.Schema({
    date_comin: {
        type: String,
    },
    date_comout: {
        type: String
    },
    fname: {
        type: String,
    },
    sname: {
        type: String,
    },
    num_people: {
        type: Number 
    },
    num_bed: {
        type: Number
    }
});

let BookingHotel = module.exports = mongoose.model('BookingHotel', bookingHotelSchema);