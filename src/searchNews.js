var axios = require('axios');

function searchNews(searchTermArr, key, url) {

  var newsMessage = {
    icon_emoji: ':newspaper:',
    text: 'The latest headlines for ' + searchTermArr.join(' '),
    attachments: [],
  };

  axios
    .get('http://eventregistry.org/json/article?query={"$query":{"$and":[{"keyword":{"$and":' + JSON.stringify(searchTermArr) + '}},{"lang":"eng"}]}}&action=getArticles&resultType=articles&articlesSortBy=date&articlesCount=10&apiKey=' + key)
    .then(function (reply) {

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
        console.log('searched news for "' + searchTermArr.join(' ') + '"" at ' + new Date());
      });
    })
    .catch(function(e) {
      console.log('error getting news from newsAPI: ' + e);
    });
}

module.exports = searchNews;
