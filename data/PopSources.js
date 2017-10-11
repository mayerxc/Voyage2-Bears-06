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

const popSources = [
  { text: 'Buzzfeed (buzzfeed)', value: 'buzzfeed' },
  {
    text: 'Entertainment Weekly (entertainment-weekly)',
    value: 'entertainment-weekly',
  },
  { text: 'Reddit /r/all (reddit-r-all)', value: 'reddit-r-all' },
  {
    text: 'The Huffington Post (the-huffington-post)',
    value: 'the-huffington-post',
  },
  {
    text: 'The Lad Bible (the-lad-bible)',
    value: 'the-lad-bible',
  },
];

module.exports = popSources;
