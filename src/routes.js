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
 */

// we send this `help` response from at least 2 places
function sendHelp(res) {
  return res.json({
    "response_type": "in_channel",
     "text": "I am a newsbot. Type `/news` and I'll send you the latest news headlines.",
     "attachments": [
      {"mrkdwn_in": ["text", "pretext"],
       "pretext": "You can ask me for headlines from any of six categories: `news`, `sports`, `finance`, `pop`, `science`, and `tech`.",
       "text": "Try typing `/news tech`.",
       "color": "#36a64f"
      },
      {"mrkdwn_in": ["text"],
      "pretext": "You can also mix it up within a category:",
       "color": "#36a64f",
       "text": "Try `/news tech random`"
      },
      {"mrkdwn_in": ["text"],
      "pretext": "...or get totally random news.",
       "color": "#36a64f",
       "text": "Type `/news random`"
      },
      {"mrkdwn_in": ["text"],
      "pretext": "If you have a search term in mind, try this:",
       "color": "#36a64f",
       "text": "`/news bananas`"
      },
      {"mrkdwn_in": ["text"],
      "pretext": "..or limit the search to a category.",
       "color": "#36a64f",
       "text": "`/news science bananas`"
      },
      {"mrkdwn_in": ["text", "pretext"],
      "pretext": "Of course, you found this by asking for help",
       "color": "#36a64f",
       "text": "`/news help`"
      }
    ]
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

/**
 *
 * INSTALL NEW TEAM: this route will acknowledge and redirect, when a new team
 * installs the app. 
 * 
 * This URL must be set in the `Redirect URLs` section
 * of the app's settings: https://api.slack.com/apps/A7F31FZ1D/oauth
 *
 */
router.get('/install', function(req, res) {
  // console.log(req.query);

  // slack sends a one-time `code` in the request
  var code = req.query.code;

  // add that code to our id (public) and secret (private) in an `oauth.access` querystring
  var oauthURL =
    'https://slack.com/api/oauth.access?client_id=210281709219.253103543047&client_secret=' +
    process.env.CLIENT_SECRET +
    '&code=' +
    code;

  // Use newly created URL in a GET request to slack's API
  axios
    .get(oauthURL)
    .then(function(response) {
      // console.log(response.data)

      // more complicated 'bots save info from `response.data` in databases, etc.
      // I just use it to create redirect back to installing team's slack page
      res.redirect('http://' + response.data.team_name + '.slack.com');
    })
    .catch(function(error) {
      console.log(error);
      res.send({ message: 'something went wrong' });
    });
});

module.exports = router;
