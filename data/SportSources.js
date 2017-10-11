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

const sportSources = [
  { text: 'BBC Sport (bbc-sport)', value: 'bbc-sport' },
  { text: 'ESPN (espn)', value: 'espn' },
  {
    text: 'ESPN Cric Info (espn-cric-info)',
    value: 'espn-cric-info',
  },
  {
    text: 'Football Italia (football-italia)',
    value: 'football-italia',
  },
  { text: 'FourFourTwo (four-four-two)', value: 'four-four-two' },
  { text: 'Fox Sports (fox-sports)', value: 'fox-sports' },
  { text: 'NFL News (nfl-news)', value: 'nfl-news' },
  { text: 'TalkSport (talksport)', value: 'talksport' },
  {
    text: 'The Sport Bible (the-sport-bible)',
    value: 'the-sport-bible',
  },
];

module.exports = sportSources;
