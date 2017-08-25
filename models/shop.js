const mongoose = require('mongoose');
const config = require('../config/database');
const Menu = require('../models/menu');

const ShopSchema = mongoose.Schema({
    shopName: {
        type: String,
        required: true
    },
    menu: {
        type: [Menu.schema],
        required: true
    },
    deal: {
        type: [Menu.schema],
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const Shop = module.exports = mongoose.model('Shop', ShopSchema);

module.exports.addShop = function (newShop, callback) {
    newShop.save(callback);
}