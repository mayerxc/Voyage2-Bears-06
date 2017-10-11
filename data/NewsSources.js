// const newsSources = [];
// axios
//   .get('https://newsapi.org/v1/sources?language=en')
//   .then(response => {
//     response.data.sources.forEach(item => {
//       newsSources.push({
//         text: `${item.name} (${item.id})`,
//         value: item.id,
//       });
//     });
//   })
//   .then(() => {
//     console.log(newsSources);
//   })

const newsSources = [
  { text: 'ABC News (AU) (abc-news-au)', value: 'abc-news-au' },
  {
    text: 'Al Jazeera English (al-jazeera-english)',
    value: 'al-jazeera-english',
  },
  {
    text: 'Associated Press (associated-press)',
    value: 'associated-press',
  },
  { text: 'BBC News (bbc-news)', value: 'bbc-news' },
  { text: 'CNN (cnn)', value: 'cnn' },
  { text: 'Daily Mail (daily-mail)', value: 'daily-mail' },
  { text: 'Google News (google-news)', value: 'google-news' },
  { text: 'Independent (independent)', value: 'independent' },

  { text: 'Metro (metro)', value: 'metro' },
  { text: 'Mirror (mirror)', value: 'mirror' },
  { text: 'MTV News (mtv-news)', value: 'mtv-news' },
  { text: 'MTV News (UK) (mtv-news-uk)', value: 'mtv-news-uk' },
  {
    text: 'National Geographic (national-geographic)',
    value: 'national-geographic',
  },
  {
    text: 'New Scientist (new-scientist)',
    value: 'new-scientist',
  },
  { text: 'Newsweek (newsweek)', value: 'newsweek' },
  {
    text: 'New York Magazine (new-york-magazine)',
    value: 'new-york-magazine',
  },
  { text: 'Reuters (reuters)', value: 'reuters' },
  {
    text: 'The Guardian (AU) (the-guardian-au)',
    value: 'the-guardian-au',
  },
  {
    text: 'The Guardian (UK) (the-guardian-uk)',
    value: 'the-guardian-uk',
  },
  { text: 'The Hindu (the-hindu)', value: 'the-hindu' },
  {
    text: 'The Huffington Post (the-huffington-post)',
    value: 'the-huffington-post',
  },
  {
    text: 'The New York Times (the-new-york-times)',
    value: 'the-new-york-times',
  },
  {
    text: 'The Telegraph (the-telegraph)',
    value: 'the-telegraph',
  },
  {
    text: 'The Times of India (the-times-of-india)',
    value: 'the-times-of-india',
  },
  {
    text: 'The Washington Post (the-washington-post)',
    value: 'the-washington-post',
  },
  { text: 'Time (time)', value: 'time' },
  { text: 'USA Today (usa-today)', value: 'usa-today' },
];

module.exports = newsSources;
