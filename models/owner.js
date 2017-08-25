const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const OwnerSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const Owner = module.exports = mongoose.model('Owner', OwnerSchema);

module.exports.addOwner = function (owner, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(owner.password, salt, (err, hash) => {
            if (err)
                throw err;

            owner.password = hash;
            owner.save(callback);
        });
    });
}

module.exports.getUserById = function (id, callback) {
    Owner.findById(id, callback);
}

module.exports.getUserByUsername = function (username, callback) {
    const query = {username: username}
    Owner.findOne(query, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err)
            throw err;
        callback(null, isMatch);
    });
}
