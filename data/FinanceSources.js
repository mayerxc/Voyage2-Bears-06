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

const financeSources = [
  { text: 'Bloomberg (bloomberg)', value: 'bloomberg' },
  {
    text: 'Business Insider (business-insider)',
    value: 'business-insider',
  },
  {
    text: 'Business Insider (UK) (business-insider-uk)',
    value: 'business-insider-uk',
  },
  { text: 'CNBC (cnbc)', value: 'cnbc' },
  {
    text: 'Financial Times (financial-times)',
    value: 'financial-times',
  },
  { text: 'Fortune (fortune)', value: 'fortune' },
  {
    text: 'The Economist (the-economist)',
    value: 'the-economist',
  },
  {
    text: 'The Wall Street Journal (the-wall-street-journal)',
    value: 'the-wall-street-journal',
  },
];

module.exports = financeSources;
