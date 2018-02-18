require('./../config/config');
// require('./socket')(io);
const routes = require('./routes/index');
const { mongoose } = require('./../db/mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const cors = require('cors');


const port = process.env.PORT || 3000

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

const corsWhitelist = ['http://localhost:8080',  'https://nodejs-todo-frontend.herokuapp.com/',
'https://nodejs-vue-js-todo.herokuapp.com/'];
app.use(bodyParser.json());
app.use(cors({
  origin: function (origin, callback) {
    if (corsWhitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  exposedHeaders: ['x-auth', 'X-Auth', 'Content-Type'],
  credentials: true,
}));

app.use('/', routes);


io.on('connection', function(socket) {
  console.log('User connected');

  // Called when a group is created and when a user gets added
  // Used to update the groups list page
  socket.on('groupChanges', () => {
    io.emit('groupChanges');
  });

  // Called when a user is removed from a group
  socket.on('kickedUser', ({ memberId, groupId }) => {
    io.emit('kickedUser', { memberId, groupId });
  });

  // Called when a todo has been added/changed/deleted
  socket.on('todoChanges', (notif) => {
    io.emit('todoChanges', notif);
  });

  // Called when a category has been added/deleted
  socket.on('categoryChanges', (notif) => {
    io.emit('categoryChanges', notif);
  });
})

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = {
  app
}
