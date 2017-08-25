const mongoose = require('mongoose');
const config = require('../config/database');
const Shop = require('../models/shop');

const MenuSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
});

const Menu = module.exports = mongoose.model('Menu', MenuSchema);

module.exports.addMenu = function (newMenu, callback) {
    Shop.find().exec(function (err, res) {
        res[0].menu.push(newMenu);
        Shop.findByIdAndUpdate(res[0]._id, res[0], callback);
    });
}

module.exports.addDeal = function (newMenu, callback) {
    Shop.find().exec(function (err, res) {
        res[0].deal.push(newMenu);
        Shop.findByIdAndUpdate(res[0]._id, res[0], callback);
    });
}