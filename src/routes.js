var express = require('express');
var router = express.Router();

var getNews = require('./getNews');
var searchNews = require('./searchNews');

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
var categories = Object.keys(sources);
var knownWords = categories.concat('help', 'random');

/**
 *
 * HELPER FUNCTIONS
 */

// we send this `help` response from at least 2 places
function sendHelp(res) {
  return res.json({
    response_type: 'in_channel', // maybe change this to 'ephemeral', later
    text:
      'I am a newsbot; you can ask me for headlines from any of six categories: ' +
      'news, sports, finance, pop, science, and tech. Try typing `/news tech` for example. ' +
      'You can also try `/news [category] random` to mix it up within a category, ' +
      'or `/news random` to get random headlines from any source I know.',
  });
}

// pick an index from an array
function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

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

  // determine if first word of user input is a news category, `help`, or `random`
  var found = knownWords.indexOf(textArr[0]) > -1;

  // if user input is empty or a single word
  if (textArr.length === 1) {
    var text = textArr[0];

    // if user input is a pre-defined word
    if (found) {
      if (text === 'help') {
        return sendHelp(res);
      } else if (text === 'news') {
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
        sourceName = 'science';
        sourceValue = 'new-scientist';
      } else if (text === 'random') {
        // pick random from all category sources
        var randomCategory = categories[getRandomIndex(categories)];
        var randomArray = sources[randomCategory];
        var rnd = getRandomIndex(randomArray);
        sourceName = randomArray[rnd].text;
        sourceValue = randomArray[rnd].value;
      }
      getNews(sourceValue, process.env.NEWS_KEY, response_url);
      return res.json({
        response_type: 'in_channel',
        text: text + ' headlines from ' + sourceName,
      });

      // if user input is not found, search news for term
    } else {
      searchNews(textArr, process.env.SEARCH_KEY, response_url);
      return res.json({
        response_type: 'in_channel',
        text: 'Headlines for ' + text,
      });
    }

    // if user input `category random` (or `category random [anything else]`)
  } else if (textArr.length > 1 && found && textArr[1] === 'random') {
    var chosenCategory = textArr[0];
    var chosenArray = sources[chosenCategory];
    var randomSource = getRandomIndex(chosenArray);
    sourceName = chosenArray[randomSource].text;
    sourceValue = chosenArray[randomSource].value;

    getNews(sourceValue, process.env.NEWS_KEY, response_url);
    return res.json({
      response_type: 'in_channel',
      text: 'gathering ' + chosenCategory + ' headlines from ' + sourceName,
    });

    // user input is a multiple word search
  } else if (categories.indexOf(textArr[0]) > -1) {
    // there's a category before other text
    var category = textArr[0];
    var toSearch = textArr.slice(1);
    searchNews(toSearch, process.env.SEARCH_KEY, response_url, category);
    return res.json({
      response_type: 'in_channel',
      text:
        'gathering headlines about ' +
        toSearch.join(' ') +
        ' from ' +
        category +
        ' sources.',
    });
  }

  // no category 'filter' at textArr[0]; search term is entire array
  searchNews(textArr, process.env.SEARCH_KEY, response_url);
  return res.json({
    response_type: 'in_channel',
    text: 'Headlines for ' + textArr.join(' '),
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

/**
   *
   * SEARCH FUNCTIONALITY: category search needs to be finished
   *
   */

/**
    *  maybe the option to type an API source directly? like `/news bbc-sport` etc?
    */

module.exports = router;
