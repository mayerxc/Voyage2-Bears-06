const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // needed to get `req.body` in the POST

app.post('/news', (req, res) => {
  // SEE: https://api.slack.com/slash-commands
  // console.log(req.body);

  if (typeof req.body.text !== 'string') {
    // also need to add a security check here; something to do with app's token
    return res.json({
      response_type: 'in_channel',
      text: 'Something went wrong...',
    });
  }

  const knownWords = ['news', 'sports', 'finance', 'pop', 'tech', 'help'];
  const text = req.body.text === '' ? 'news' : req.body.text; // assume they want '/news news' if blank
  const found = knownWords.indexOf(text) > -1;

  if (text === 'help' || !found) {
    // category not found or user entered 'help' TODO: make a separate 'help' response?
    return res.json({
      response_type: 'in_channel', // maybe change this to 'ephemeral', later
      text:
        'I am a newsbot; you can ask me for headlines from any of five categories: ' +
        'news, sports, finance, pop, and tech. Try typing `/news tech` for example.',
    });
  }

  res.json({
    response_type: 'in_channel',
    text: `headlines for ${text} will show up here`,
  });
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
