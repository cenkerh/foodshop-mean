const mongoose = require('mongoose');
const config = require('../config/database');
const Menu = require('../models/menu');


//Order Schema
const OrderSchema = mongoose.Schema({
    username: {
        type: String,//User modeli çağırılabilir
        reqired: true
    },
    order: {
        type: [Menu.schema],
        reqired: true 
    },
    orderTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Waiting for apply'
    }
});


const Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.addOrder = function (order, callback) {
    order.save(callback);
}