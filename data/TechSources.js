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

const techSources = [
  { text: 'Ars Technica (ars-technica)', value: 'ars-technica' },
  { text: 'Engadget (engadget)', value: 'engadget' },
  { text: 'Hacker News (hacker-news)', value: 'hacker-news' },
  { text: 'IGN (ign)', value: 'ign' },
  { text: 'Mashable (mashable)', value: 'mashable' },
  {
    text: 'New Scientist (new-scientist)',
    value: 'new-scientist',
  },
  { text: 'Polygon (polygon)', value: 'polygon' },
  { text: 'Recode (recode)', value: 'recode' },
  { text: 'TechCrunch (techcrunch)', value: 'techcrunch' },
  { text: 'TechRadar (techradar)', value: 'techradar' },
  { text: 'The Next Web (the-next-web)', value: 'the-next-web' },
  { text: 'The Verge (the-verge)', value: 'the-verge' },
];

module.exports = techSources;
