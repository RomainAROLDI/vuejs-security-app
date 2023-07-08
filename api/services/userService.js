const User = require('../models/User');

exports.getUserByUsername = (username) => {
    return User.findOne({ username }).exec();
};

exports.getUserWithPasswordByUsername = (username) => {
    return User.findOne({ username }, '_id username password isAdmin').exec();
};

exports.createUser = (user) => {
    return User.create(user);
};

exports.getUserById = (id) => {
    return User.findById(id).exec();
};