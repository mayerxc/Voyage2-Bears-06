var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');

require('dotenv').config();

var app = express();

app.use(bodyParser.urlencoded({ extended: false })); // needed to get `req.body` in the POST
app.use(routes);

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
