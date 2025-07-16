import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import csv from 'csv-parser';
import cors from 'cors';
import multer from 'multer';

const app = express();
const countyDataset = [];
const PORT = process.env.PORT || 3001;
const upload = multer();

app.use(cors());

fs.createReadStream('../datasets/uscounties.csv')
  .pipe(csv())
  .on('data', (data) => countyDataset.push(data))
  .on('end', () => {
    console.log("Successfully loaded data!");
    console.log(countyDataset);
  });

app.post('/api/county', upload.none(), async (req, res) => {
  const { countyAndState } = req.body;

  if (!countyAndState) {
    return res.status(400).json({ error: 'Empty params! Must add valid county and state name' });
  }

  const [countyName, stateCode] = countyAndState.split(',').map(s => s.trim());
  const countyInfo = countyDataset.find(county => county.county_full === countyName && county.state_id === stateCode);

  const startDate = '2000-01-01';
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&latitude=${countyInfo.lat}&longitude=${countyInfo.lng}&maxradiuskm=40&minmagnitude=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching USGS data:', err);
    res.status(500).json({ error: 'Failed to fetch data from USGS' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});