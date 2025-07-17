const csv = require('csv-parser');
global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const pLimit = require('p-limit').default;
const cliProgress = require('cli-progress');

const countyDataset = [];
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: '../datasets/disasterinfo.csv',
    header: [
        {id: 'county_name', title: 'county_name'},
        {id: 'state_code', title: 'state_code'},
        {id: 'total_quakes', title: 'total_quakes'},
        {id: 'avg_mag', title: 'avg_mag'},
        {id: 'max_mag', title: 'max_mag'},
        {id: 'severe_quakes', title: 'severe_quakes'}
    ]
});

function findMax(arr, val) {
    let max = 0;
    for (const item of arr) {
        const mag = item.properties[val];
        if (mag != null && mag > max) max = mag;
    }
    return max;
}

function findSevereQuakes(arr) {
    var num = 0;
    for (const individual of arr) {
        if (individual.properties.mag >= 5.0) num++;
    }
    return num;
}

async function fetchAndExtractCountyData(county) {
    const startDate = '2000-01-01';
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&latitude=${county.lat}&longitude=${county.lng}&maxradiuskm=40&minmagnitude=1`;
    
    let data;
    let record;

    try {
        const response = await fetch(url);
        data = await response.json();
        await sleep(250);
    } catch (err) {
        console.error('Error fetching USGS data:', err);
        return;
    }
    
    record =
    {
        county_name: county.county_full, 
        state_code: county.state_id, 
        total_quakes: data.features.length, 
        avg_mag: (data.features.length !== 0 ? data.features.reduce((sum, quake) => sum + quake.properties.mag, 0) / data.features.length : 0), 
        max_mag: findMax(data.features, "mag"), 
        severe_quakes: findSevereQuakes(data.features)
    }
    return record;
}

async function county_parsing() {
    const limit = pLimit(2);
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar.start(countyDataset.length, 0);

    let completed = 0;

    const tasks = countyDataset.map(county =>
        limit(async () => {
            const result = await fetchAndExtractCountyData(county);
            completed++;
            bar.update(completed);
            return result;
        })
    );

    const records = await Promise.all(tasks);
    bar.stop();

    await csvWriter.writeRecords(records.filter(Boolean));
}

fs.createReadStream('../datasets/uscounties.csv')
  .pipe(csv())
  .on('data', (data) => countyDataset.push(data))
  .on('end', () => {
    county_parsing();
  });