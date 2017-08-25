const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Order = require('../models/order');

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        address: req.body.address
    });

    User.addUser(newUser, (err, user) =>{
        if (err) {
            res.json({success: false, msg: 'Failed to reqister user'});
        }
        else{
            res.json({success: true, msg: 'User registered'});
        }
    });
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err)
            throw err;
        if(!user)
            return res.json({success: false, msg: 'User not found'});

        User.comparePassword(password, user.password, (err, isMatch) =>{
            if(err)
                throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 3600
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        address: user.address
                    }
                });
            }
            else{
                return res.json({success: false, msg: 'Wrong Password'});
            }
        });
    });
});

//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

//Profile
router.get('/order', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    //console.log(req.user.username);
    const query = Order.find({username: req.user.username},'-__v').exec(function (err, result) {
        if (err) {
            res.json({ success: false, orders: 'Failed to GET orders' });
            throw err;
        }
        else{
            res.json({ success: true, orders: result});
        }
    });
});

//Post Order
router.post('/order', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let newOrder = new Order({
        username: req.user.username,
        order: req.body
    });
    Order.addOrder(newOrder, (err, order) => {
        if (err) {
            res.json({success: false, msg: 'Failed to place order'});
        }
        else{
            res.json({success: true, msg: 'Order placed successfully'});
        }

    });
});


module.exports = router;