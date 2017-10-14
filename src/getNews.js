var axios = require('axios');

function getNews(source, key, url) {
  var newsMessage = {
    icon_emoji: ':newspaper:',
    text: 'The latest headlines from ' + source,
    attachments: [],
  };
  axios
    .get('https://newsapi.org/v1/articles?source=' + source + '&apiKey=' + key)
    .then(function(reply) {
      reply.data.articles.forEach(function(article) {
        newsMessage.attachments.push({
          fallback: 'a news headline',
          text: article.description,
          title_link: article.url,
          title: article.title,
          thumb_url: article.urlToImage,
          color: '#' + Math.floor(Math.random() * 16777215).toString(16), // rnd hex color
        });
      });
      axios.post(url, newsMessage).then(function() {
        console.log('posted news from ' + source + ' at ' + new Date());
      });
    })
    .catch(function(e) {
      console.log('error getting news from newsAPI: ' + e);
    });
}

module.exports = getNews;
