var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://default:default@ds163806.mlab.com:63806/nodejs-todos', {
//     useMongoClient: true
// });
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
});
module.exports = {
    mongoose
}