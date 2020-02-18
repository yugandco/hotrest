const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// EXPRESS THINGS
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');

// CONECTING TO DATABASE USING MONGOOSE
const mongoose = require('mongoose');

// MONGO DB
const config = require('./config/database');
mongoose.connect(config.database, {useUnifiedTopology: true, useNewUrlParser: true});
let db = mongoose.connection;

// CONNECTING EVERYTIME
db.once('open', () => {
    console.log('connected to mLab MongoDB');
});
db.on('err', () => {
    console.log(err);
})

// PASSPORT.JS
const passport = require('passport');

// ENGINE APP
const app = express();

// BODYPARSER MIDDLEWARE
// PARSE APP URLENCODED
app.use(bodyParser.urlencoded({ extended: false }));
// PARSE APP/JSON
app.use(bodyParser.json());

// SET PUBLIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// SET VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// EXPRESS SESSION
app.use(session({
    secret: 'cat',
    resave: true,
    saveUninitialized: true,
}));

// EXPRESS MESSAGES MIDDLEWARE
app.use(require('connect-flash')());
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// EXPRESS VALIDATOR
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// PASSPORT CONFIG
require('./config/passport')(passport);
// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

// BRING USER MODEL
let User = require('./models/user');
let Hotel = require('./models/hotel');
let Rest = require('./models/Rest');


// ROUTE FILES
let users = require('./routes/users');
app.use('/', users);

// HOME ROUTE
app.get('/', (req, res) => {
    res.render('index');
});

function selectionSort(arr){
    var minIdx, temp, 
        len = arr.length;
    for(var i = 0; i < len; i++){
      minIdx = i;
      for(var  j = i+1; j<len; j++){
         if(arr[j]<arr[minIdx]){
            minIdx = j;
         }
      }
      temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
    return arr;
  }

// ADMIN ROUTE
// SORTED HOTEL ROUTE in ADMIN PAGE
app.get('/admin/hotel', esAuth, (req, res) => {
    Hotel.find({}, null, {sort: {comin_free_date: 1}} , (err, hotels) => {
        if(err){
            console.log(err);
        } else {
            res.render('adminHotel', {
                hotels: hotels,
            })
        }
    }) 
});
// ADMIN HOTEL ROUTE DELETE
app.delete('/admin/hotel/:id', (req, res) => {
    let query = {_id:req.params.id};

    Hotel.remove(query, (err) => {
        if(err){
            console.log(err);
        };
        res.send('Success');
    })
});


// SORTED RESTAURANT ROUTE in ADMIN PAGE
app.get('/admin/restaurant', esAuth, (req, res) => {
    Rest.find({},  null, {sort: {comin_date: 1}} ,(err, rests) => {
        if(err){
            console.log(err);
        } else {
            res.render('adminRest', {
                rests: rests
            })
        }
    })
});

// ADMIN HOTEL ROUTE DELETE
app.delete('/admin/restaurant/:id', (req, res) => {
    let query = {_id:req.params.id};

    Rest.remove(query, (err) => {
        if(err){
            console.log(err);
        };
        res.send('Success');
    })
});


//  SINGLE USER ROUTE
app.get('/id/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
                user: user
            })
        }
    })
})
app.get('/user/id/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        Hotel.find({user__id: req.params.id}, (err, hotels) => {
            Rest.find({user__id: req.params.id}, (err, rests) => {
                if(err) {
                    console.log(err);
                } else {
                    res.render('user', {
                        user: user,
                        hotels: hotels,
                        rests: rests
                    })
                }
            })
        })
    })
})

// HOTEL ROUTE
app.get('/hotel/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
            if(err) {
                console.log(err);
            } else {
                res.render('singleHotel', {
                    user: user
                });
            }
        })
})

// app.get('/hotel/add-room', (req, res) => {
//     res.render('addHotel');
// })

app.post('/hotel/:id', (req, res) => {
    let hotel = new Hotel();
    hotel.user__id = req.params.id;
    hotel.type_rooms = req.body.type_rooms;
    hotel.num_rooms = req.body.num_rooms;
    hotel.num_people = req.body.num_people;
    hotel.num_bed = req.body.num_bed;
    hotel.included = req.body.included;
    hotel.comin_free_date = req.body.comin_free_date;
    hotel.comout_free_date = req.body.comout_free_date;

    hotel.save((err) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('/user/id/' + req.params.id);
        }
    })
})

// REST ROUTE
app.get('/restaurant/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err){
            console.log(err);
        } else {
            res.render('singleRest', {
                user: user
            })
        }
    })
})

app.post('/restaurant/:id', (req, res) => {
    let rest = new Rest();
    rest.user__id = req.params.id;
    rest.num_people = req.body.num_people;
    rest.type_client = req.body.type_client;
    rest.comin_date = req.body.comin_date;

    rest.save((err) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('/user/id/' + req.params.id);
        }
    })
})

function esAuth(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/login');
    }
};


const PORT = 8888;
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})