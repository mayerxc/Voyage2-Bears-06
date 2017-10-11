const express = require('express');
const router = express.Router();

const financeSources = require('./data/FinanceSources');
const newsSources = require('./data/NewsSources');
const popSources = require('./data/PopSources');
const sportSources = require('./data/SportSources');
const techSources = require('./data/TechSources');

/**
 *
 * SLASH-COMMAND ROUTE: slack POSTs to this route, /news
 * 
 */

router.post('/news', (req, res) => {
  // SEE: https://api.slack.com/slash-commands
  // console.log(req.body);

  // sanity check, make sure slack sent us a text string on req.body
  if (typeof req.body.text !== 'string') {
    return res.json({
      response_type: 'in_channel',
      text: 'Something went wrong...',
    });
  }
  // array of recognized words:
  const knownWords = ['news', 'sports', 'finance', 'pop', 'tech', 'help'];
  // assign variable for user's input. Assume they meant '/news news' if they only typed `/news`
  const text = req.body.text === '' ? 'news' : req.body.text;
  const found = knownWords.indexOf(text) > -1;

  // user entered 'help' or any other text we don't recognize?
  if (text === 'help' || !found) {
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

// TODO:

/**
 *
 * INTERACTIVE MESSAGE HANDLER: TBD, if we end up using buttons or dropdowns
 * 
 */

/**
 *
 * INSTALL NEW TEAM: this route will acknowledge and redirect, when a new team
 * installs the app. (must be called '/install' I think)
 * 
 */

module.exports = router;
