var express = require('express');
var router = express.Router();

var getNews = require('./getNews');

var financeSources = require('../data/FinanceSources');
var newsSources = require('../data/NewsSources');
var popSources = require('../data/PopSources');
var sportsSources = require('../data/SportsSources');
var techSources = require('../data/TechSources');
var sources = {
  finance: financeSources,
  news: newsSources,
  pop: popSources,
  sports: sportsSources,
  tech: techSources,
};

/**
 *
 * SLASH-COMMAND ROUTE: slack POSTs to this route, /news
 * 
 */
router.post('/news', function(req, res) {
  //console.log(req.body);

  // sanity check, make sure slack sent us a text string on req.body
  if (typeof req.body.text !== 'string') {
    return res.json({
      response_type: 'in_channel',
      text: 'Something went wrong...',
    });
  }
  var response_url = req.body.response_url;
  // assign variable for user's input. Assume they meant '/news news' if they only typed `/news`
  var text = req.body.text === '' ? 'news' : req.body.text;
  // array of recognized words:
  var knownWords = ['news', 'sports', 'finance', 'pop', 'tech', 'help'];
  // if text is in knownWords array, variable `found` is true, else false.
  var found = knownWords.indexOf(text) > -1;

  // user entered 'help' or any other text we don't recognize?
  if (text === 'help' || !found) {
    return res.json({
      response_type: 'in_channel', // maybe change this to 'ephemeral', later
      text:
        'I am a newsbot; you can ask me for headlines from any of five categories: ' +
        'news, sports, finance, pop, and tech. Try typing `/news tech` for example.',
    });
  }

  // user entered a valid category
  var categoryArray = sources[text];
  // get random source from that category
  var rnd = Math.floor(Math.random() * categoryArray.length);
  var sourceName = categoryArray[rnd].text;
  var sourceValue = categoryArray[rnd].value;
  // request news from API and send it to user
  getNews(sourceValue, process.env.NEWS_KEY, response_url);
  return res.json({
    response_type: 'in_channel',
    text: 'headlines for ' + text + ' from ' + sourceName,
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
