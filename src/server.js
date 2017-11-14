var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');

require('dotenv').config();

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);
app.use(express.static('public'));

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
