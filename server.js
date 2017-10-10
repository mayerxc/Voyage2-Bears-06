var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false })); // needed to get `req.body` in the POST

app.post('/news', (req, res) => {
  // SEE: https://api.slack.com/slash-commands
  console.log(req.body);
  res.json({
    response_type: 'in_channel',
    text: 'Hello from newsbot. Change this all you want.',
  });
});

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
