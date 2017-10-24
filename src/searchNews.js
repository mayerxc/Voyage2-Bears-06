var axios = require('axios');

function searchNews(searchTermArr, key, url, category) {
  var dbCat = '';
  switch (category) {
    case '':
      break;
    case 'finance':
      dbCat = 'dmoz/Business';
      break;
    case 'pop':
      dbCat = 'dmoz/Society/People/Celebrities';
      break;
    case 'tech':
      dbCat = 'dmoz/Computers';
      break;
    case 'science':
      dbCat = 'dmoz/Science';
      break;
    case 'sports':
      dbCat = 'dmoz/Sports';
      break;
    case 'news':
      dbCat = 'dmoz/Society/'; //Regional/North_America never returned anything.
      break;
    default:
      break;
  }
  var newsMessage = {
    icon_emoji: ':newspaper:',
    text: 'The latest headlines for ' + searchTermArr.join(' '),
    attachments: [],
  };

  var queryURL =
    'http://eventregistry.org/json/article?query={"$query":{"$and":[{"keyword":{"$and":' +
    JSON.stringify(searchTermArr) +
    '}},{"lang":"eng"}]}}&action=getArticles&resultType=articles&articlesSortBy=date&articlesCount=10&apiKey=' +
    key;
  if (dbCat !== '') {
    queryURL =
      'http://eventregistry.org/json/article?query={"$query":{"$and":[{"categoryUri":"' +
      dbCat +
      '"},{"keyword":{"$and":' +
      JSON.stringify(searchTermArr) +
      '}},{"lang":"eng"}]}}&action=getArticles&resultType=articles&articlesSortBy=date&articlesCount=10&apiKey=' +
      key;
  }
  console.log(queryURL);
  axios
    .get(queryURL)
    .then(function(reply) {
      // get relevant information from articles
      reply.data.articles.results.forEach(function(result) {
        if (!result.isDuplicate) {
          newsMessage.attachments.push({
            fallback: 'a news headline',
            text: result.body,
            title_link: result.url,
            title: result.title,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16), // rnd hex color
          });
        }
      });

      // return relevant information
      axios.post(url, newsMessage).then(function() {
        var source = dbCat !== '' ? dbCat : 'all categories';
        console.log(
          'searched news in ' +
            source +
            ' for "' +
            searchTermArr.join(' ') +
            '" at ' +
            new Date()
        );
      });
    })
    .catch(function(e) {
      console.log('error getting news from newsAPI: ' + e);
      newsMessage.attachments.push({
        fallback: 'an error occured',
        text: 'Something went wrong with that search, on the API side.',
      });
      axios.post(url, newsMessage);
    });
}

module.exports = searchNews;
