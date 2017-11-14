var express = require('express');
var router = express.Router();
var axios = require('axios');

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
 *
 */

function sendHelp(res) {
  return res.json({
    response_type: 'ephemeral',
    text:
      "I am a newsbot. Type `/news` and I'll send you the latest news headlines.",
    attachments: [
      {
        mrkdwn_in: ['text', 'pretext'],
        pretext:
          'You can ask me for headlines from any of six categories: `news`, `sports`, `finance`, `pop`, `science`, and `tech`.',
        text: 'Try typing `/news tech`.',
        color: '#36a64f',
      },
      {
        mrkdwn_in: ['text'],
        pretext: 'You can also mix it up within a category:',
        color: '#36a64f',
        text: 'Try `/news tech random`',
      },
      {
        mrkdwn_in: ['text'],
        pretext: '...or get totally random news.',
        color: '#36a64f',
        text: 'Type `/news random`',
      },
      {
        mrkdwn_in: ['text'],
        pretext: 'If you have a search term in mind, try this:',
        color: '#36a64f',
        text: '`/news bananas`',
      },
      {
        mrkdwn_in: ['text'],
        pretext: '..or limit the search to a category.',
        color: '#36a64f',
        text: '`/news science bananas`',
      },
      {
        mrkdwn_in: ['text', 'pretext'],
        pretext: 'Of course, you found this by asking for help',
        color: '#36a64f',
        text: '`/news help`',
      },
    ],
  });
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

/**
 *
 * SLASH-COMMAND ROUTE: slack POSTs to this route, /news
 *
 */
router.post('/news', function(req, res) {
  if (typeof req.body.text !== 'string') {
    return res.json({
      response_type: 'ephemeral',
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

  // if first word of user input is a known word (i.e. a news category, `help`, or `random`)
  if (knownWords.indexOf(textArr[0]) > -1) {

    // if user inputs '/news' or '/news [category]' or '/news random'
    if (textArr.length === 1) {
      var text = textArr[0];
      if (text === 'help') {
        return sendHelp(res);
      } else if (text === 'news') {
        sourceName = 'Google News';
        sourceValue = 'google-news';
      } else if (text === 'sports') {
        sourceName = 'ESPN';
        sourceValue = 'espn';
      } else if (text === 'finance') {
        sourceName = 'Bloomberg';
        sourceValue = 'bloomberg';
      } else if (text === 'pop') {
        sourceName = 'MTV News';
        sourceValue = 'mtv-news';
      } else if (text === 'tech') {
        sourceName = 'Engadget';
        sourceValue = 'engadget';
      } else if (text === 'science') {
        sourceName = 'New Scientist';
        sourceValue = 'new-scientist';
      } else if (text === 'random') {
        var choosenSources = sources[categories[getRandomIndex(categories)]];
        var choosenSourceIndex = getRandomIndex(choosenSources);
        sourceName = choosenSources[choosenSourceIndex].text;
        sourceValue = choosenSources[choosenSourceIndex].value;
      }
      getNews(sourceValue, process.env.NEWS_KEY, response_url);
      return res.json({
        response_type: 'ephemeral',
        text: 'Gathering ' + text + ' headlines from ' + sourceName + '...',
      });

    // if user inputs '/news [category] random'
    } else if (textArr.length === 2 && sources.hasOwnProperty(textArr[0]) && textArr[1] === 'random') {
      var chosenCategory = textArr[0];
      var chosenArray = sources[chosenCategory];
      var randomSource = getRandomIndex(chosenArray);
      sourceName = chosenArray[randomSource].text;
      sourceValue = chosenArray[randomSource].value;
      getNews(sourceValue, process.env.NEWS_KEY, response_url);
      return res.json({
        response_type: 'ephemeral',
        text: 'Gathering ' + chosenCategory + ' headlines from ' + sourceName + '...'
      });

    // if user inputs '/news [category] [search-term]'
    } else if (sources.hasOwnProperty(textArr[0])) {
      var category = textArr[0];
      var toSearch = textArr.slice(1);
      searchNews(toSearch, process.env.SEARCH_KEY, response_url, category);
      return res.json({
        response_type: 'ephemeral',
        text:
          'Gathering headlines about ' +
          toSearch.join(' ') +
          ' from ' +
          category +
          ' sources...',
      });

    // if user inputs '/news random [search-term]' or 'news help [search-term]'
    } else {
      searchNews(textArr, process.env.SEARCH_KEY, response_url);
      return res.json({
        response_type: 'ephemeral',
        text: 'Gathering headlines for ' + textArr.join(' ') + '...',
      });
    }

    // if first word of user input is unknown
    } else {
      searchNews(textArr, process.env.SEARCH_KEY, response_url);
      return res.json({
        response_type: 'ephemeral',
        text: 'Gathering headlines for ' + textArr.join(' ') + '...',
    });
  }
});

/**
 *
 * INSTALL NEW TEAM: this route will acknowledge and redirect, when a new team
 * installs the app.
 */
router.get('/install', function(req, res) {
  var code = req.query.code;
  var oauthURL =
    'https://slack.com/api/oauth.access?client_id=210281709219.253103543047&client_secret=' +
    process.env.CLIENT_SECRET +
    '&code=' +
    code;
  axios
    .get(oauthURL)
    .then(function(response) {
      res.redirect('http://' + response.data.team_name + '.slack.com');
    })
    .catch(function(error) {
      console.log(error);
      res.send({ message: 'something went wrong' });
    });
});

module.exports = router;
