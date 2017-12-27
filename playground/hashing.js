const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');



var message = 'This is a message';

var hash = SHA256(message).toString();

// console.log(message, hash);

var data = {
    id: 4
};

var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log(decoded)

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'fakesalt').toString()
// }

// var resultHash = SHA256(JSON.stringify(data) + 'fakesalt').toString();
// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed');
// }