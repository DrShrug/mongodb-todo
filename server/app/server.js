require('./../config/config');
const routes = require('./routes/index');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const cors = require('cors');

const port = process.env.PORT || 3000

var app = express();

app.use(bodyParser.json());
app.use(cors({
  exposedHeaders: ['x-auth', 'X-Auth', 'Content-Type']
}));

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = {
  app
}
