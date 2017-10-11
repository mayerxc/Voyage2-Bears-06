const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // needed to get `req.body` in the POST
app.use(routes);

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
