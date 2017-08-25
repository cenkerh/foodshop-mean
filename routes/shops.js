const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Menu = require('../models/menu');
const Shop = require('../models/shop');
const Order = require('../models/order');
const User = require('../models/user');
const Owner = require('../models/owner');


//Add Owner
router.post('/addOwner', (req, res, next) => {

    let owner = new Owner({
        username: req.body.name,
        password: req.body.price
    });

    Owner.addOwner(owner, (err, owner) => {
        if (err) {
            res.json({ success: false, result: 'Failed to add owner' });
        }
        else {
            res.json({ success: true, result: 'Owner added' });
        }
    });
});

//Authenticate Owner
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;


    Owner.getUserByUsername(username, (err, user) => {
        if (err)
            throw err;
        if (!user)
            return res.json({ success: false, msg: 'User not found' });

        Owner.comparePassword(password, user.password, (err, isMatch) => {
            if (err)
                throw err;
            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 3600
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        username: user.username,
                    }
                });
            }
            else {
                return res.json({ success: false, msg: 'Wrong Password' });
            }
        });
    });
});


//Add Menu
router.post('/addMenu', (req, res, next) => {

    let newMenu = new Menu({
        name: req.body.name,
        price: req.body.price
    });

    Menu.addMenu(newMenu, (err, menu) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to add menu' });
        }
        else {
            res.json({ success: true, msg: 'New menu added' });
        }
    });
});

//Flash Deals
router.post('/addDeal', (req, res, next) => {

    let newMenu = new Menu({
        name: req.body.name,
        price: req.body.price
    });

    Menu.addDeal(newMenu, (err, menu) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to add flash deal' });
        }
        else {
            res.json({ success: true, msg: 'New menu added' });
        }
    });
});

//Add Shop
router.post('/addShop', (req, res, next) => {
    let newShop = new Shop({
        shopName: req.body.shopName,
        menu: req.body.menu,
        deal: req.body.deal,
        address: req.body.address
    });

    Shop.addShop(newShop, (err, order) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to add the shop' });
        }
        else {
            res.json({ success: true, msg: newShop });
        }

    });
});


//Get Orders
router.get('/orders', (req, res, next) => {
    const query = Order.find({}, '-__v').exec(function (err, result) {
        if (err) {
            res.json({ success: false, order: 'Failed to GET orders' });
            throw err;
        }
        else {
            res.json({ success: true, order: result });
        }
    });
});

//Update Order's Status
router.put('/orders/:id.:process', (req, res, next) => {
    const id = req.params.id;
    const process = req.params.process;

    Order.findOneAndUpdate({ _id: id }, { $set: { status: process } }, { upsert: true }, function (err, order) {
        if (err) {
            res.json({ success: false, msg: 'Failed to update status' });
        }
        else {
            res.json({ success: true, msg: 'Order is updated to On The Way' });
        }
    });
});

//Get Menus
router.get('/menu', (req, res, next) => {
    const query = Shop.find().select('menu -_id').exec(function (err, result) {
        if (err) {
            res.json({ success: false, menu: 'Failed to GET menus' });
            throw err;
        }
        else {
            res.json({ success: true, menu: result });
        }
    });
});

//Get Deals
router.get('/deal', (req, res, next) => {
    const query = Shop.find().select('deal -_id').exec(function (err, result) {
        if (err) {
            res.json({ success: false, deal: 'Failed to GET flash deals' });
            throw err;
        }
        else {
            res.json({ success: true, deal: result });
        }
    });
});


module.exports = router;