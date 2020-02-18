const mongoose = require('mongoose');

let bookingRestSchema = mongoose.Schema({
    date_comin: {
        type: String
    },
    date_comout: {
        type: String
    },
    fname: {
        type: String
    },
    sname: {
        type: String
    },
    num_tables: {
        type: Number
    },
    num_people: {
        type: Number
    }
});

let BookingRest = module.exports = mongoose.model('BookingRest', bookingRestSchema);