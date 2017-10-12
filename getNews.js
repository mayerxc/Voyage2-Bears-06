const axios = require('axios');

function getNews(source, key, url) {
  const newsMessage = {
    icon_emoji: ':newspaper:',
    text: `The latest headlines from ${source}`,
    attachments: [],
  };
  axios
    .get(`https://newsapi.org/v1/articles?source=${source}&apiKey=${key}`)
    .then(reply => {
      reply.data.articles.forEach(a => {
        newsMessage.attachments.push({
          fallback: 'a news headline',
          text: a.description,
          title_link: a.url,
          title: a.title,
          thumb_url: a.urlToImage,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        });
      });
      axios
        .post(url, newsMessage)
        .then(() => console.log(`posted news from ${source} at ${new Date()}`))
        .catch(() => console.log('error posting response to slack'));
    })
    .catch(e => console.log(`error getting news from newsAPI: ${e}`));
}

module.exports = getNews;
