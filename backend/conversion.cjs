const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('../datasets/disasterinfo_with_predictions.csv')
  .pipe(csv())
  .on('data', (data) => {
    data.total_quakes = parseFloat(data.total_quakes);
    data.avg_mag = parseFloat(data.avg_mag);
    data.max_mag = parseFloat(data.max_mag);
    data.severe_quakes = parseFloat(data.severe_quakes);
    data.quake_risk_score = parseFloat(data.quake_risk_score);
    data.predicted_score = parseFloat(data.predicted_score);
    data.scaled_score = parseFloat(data.scaled_score);
    results.push(data);
  })
  .on('end', () => {
    fs.writeFileSync('../frontend/public/data/disaster_info.json', JSON.stringify(results, null, 2));
    console.log('CSV converted to JSON!');
  });