const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// BRING USER MODEL
let User = require('../models/user');

// SIGN UP ROUTE
route.get('/registr', (req, res) => {
    res.render('registr');
})

route.post('/registr', (req, res) => {
    const fname = req.body.fname;
    const sname = req.body.sname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('fname', 'First name is required').notEmpty();
    req.checkBody('sname', 'Second name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('username', 'Usename is required').notEmpty();
    req.checkBody('password', 'Password is required');
    req.checkBody('password2', 'Repeat password is required').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        res.render('registr', {
            errors: errors
        });
    } else {
        let newUser = new User({
            fname: fname,
            sname: sname,
            email: email,
            username: username,
            password: password
        });

        bcrypt.genSalt(10, (err, salt) => {
            if(err){throw err};
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save((err) => {
                    if(err){
                        return console.log(err);
                    } else {
                        req.flash('success', 'You are registred and can log in');
                        res.redirect('/login');
                    }
                })
            })
        })

    }
    
});

route.get('/login', (req, res) => {
    res.render('login');
})

route.post('/login', function(req, res, next) {
    passport.authenticate('local', {failureFlash:true}, function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { 
            return res.redirect('/login'); 
        }
    req.logIn(user, function(err) {
        if (err) { return next(err); }
        if (user.username === 'Admin') {
            return res.redirect('/admin/hotel');
      } else {
            return res.redirect('/');  
      }
   });
})(req, res, next);
});

// SIGN OUT PROCESS
route.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You successfully log out');
    res.redirect('/login');
})



module.exports = route;