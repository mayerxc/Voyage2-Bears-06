var express = require('express');
var router = express.Router();

var getNews = require('./getNews');

var financeSources = require('../data/FinanceSources');
var newsSources = require('../data/NewsSources');
var popSources = require('../data/PopSources');
var scienceSources = require('../data/ScienceSources');
var sportsSources = require('../data/SportsSources');
var techSources = require('../data/TechSources');
var sources = {
  finance: financeSources,
  news: newsSources,
  pop: popSources,
  science: scienceSources,
  sports: sportsSources,
  tech: techSources,
};
var knownWords = Object.keys(sources);
knownWords.push('help', 'random');

/**
 *
 * SLASH-COMMAND ROUTE: slack POSTs to this route, /news
 *
 */
router.post('/news', function(req, res) {
  // console.log(req.body);

  // sanity check, make sure slack sent us a text string on req.body
  if (typeof req.body.text !== 'string') {
    return res.json({
      response_type: 'in_channel',
      text: 'Something went wrong...',
    });
  }
  var response_url = req.body.response_url;

  // turn user input into array of words
  var textArr = (function(text) {
    // text is defined
    if (text) {
      var i = 0;
      var j = 0;
      var wordFound = true;
      var result = [];
      while (text[i] != undefined) {
        if (text[i] == ' ' && wordFound) {
          wordFound = false;
          result.push(text.slice(j, i));
        }
        if (text[i] != ' ' && !wordFound) {
          wordFound = true;
          j = i;
        }
        i++;
      }
      result.push(text.slice(j, text.length));
      return result;
    // text isn't defined
    } else {
      return ['news'];
    }
  })(req.body.text);

  // define source(s) to be looked up by newsapi
  var sourceName = '';
  var sourceValue = '';

  // if user input is empty or a single word
  if (textArr.length === 1) {

    var text = textArr[0];

    // determine if first word of user input is a news category
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

    if (text === 'news') {
      sourceName = 'Associated Press';
      sourceValue = 'associated-press';
    } else if (text === 'sports') {
      sourceName = 'ESPN';
      sourceValue = 'espn';
    } else if (text === 'finance') {
      sourceName = 'Bloomberg';
      sourceValue = 'bloomberg';
    } else if (text === 'pop') {
      sourceName = 'Entertainment Weekly';
      sourceValue = 'entertainment-weekly';
    } else if (text === 'tech') {
      sourceName = 'Engadget';
      sourceValue = 'engadget';
    } else if (text === 'science') {
      sourceName = 'value';
      sourceValue = 'new-scientist';
    } else if (text === 'random') {
      var sourcesArray = Object.keys(sources);
      // user entered a valid category
      var categoryArray = sources[sourcesArray[Math.floor(Math.random() * sourcesArray.length)]];
      // get random source from that category
      var rnd = Math.floor(Math.random() * categoryArray.length);
      sourceName = categoryArray[rnd].text;
      sourceValue = categoryArray[rnd].value;
    }

    // request news from API and send it to user
    getNews(sourceValue, process.env.NEWS_KEY, response_url);
    return res.json({
      response_type: 'in_channel',
      text: 'headlines for ' + text + ' from ' + sourceName,
    });

  // if user input more than one word
  } else {
    return res.json({
      response_type: 'in_channel', // maybe change this to 'ephemeral', later
      text:
        'I am a newsbot; you can ask me for headlines from any of five categories: ' +
        'news, sports, finance, pop, and tech. Try typing `/news tech` for example.',
    });
  }

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

 /**
  *
  * RANDOM SOURCE FOR EACH CATEGORY: for example '/news finance random' will pick a random source from finance sources
  *
  */

  /**
   *
   * SEARCH FUNCTIONALITY: tbd
   *
   */

module.exports = router;
