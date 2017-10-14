/**
 * NOTE: I didn't build these data arrays by hand; I used the following API call
 * to pull them into one big array. By hand, I split them into categories
 * and saved to different files (for clarity).
 * 
 * This is an example of the sources API call:
 */

// var newsSources = [];
// axios
//   .get('https://newsapi.org/v1/sources?language=en')
//   .then(response => {
//     response.data.sources.forEach(item => {         // or use .map()?
//       newsSources.push({ text: item.name, value: item.id });
//     });
//   })
//   .then(() => {
//     console.log(newsSources);
//   })

var financeSources = [
  { text: 'Bloomberg', value: 'bloomberg' },
  { text: 'Business Insider', value: 'business-insider' },
  { text: 'Business Insider (UK)', value: 'business-insider-uk' },
  { text: 'CNBC', value: 'cnbc' },
  { text: 'Financial Times', value: 'financial-times' },
  { text: 'Fortune', value: 'fortune' },
  { text: 'The Economist', value: 'the-economist' },
  { text: 'The Wall Street Journal', value: 'the-wall-street-journal' },
];

module.exports = financeSources;
