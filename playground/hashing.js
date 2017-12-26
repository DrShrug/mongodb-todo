const {SHA256} = require('crypto-js');

var message = 'This is a message';

var hash = SHA256(message).toString();

console.log(message, hash);