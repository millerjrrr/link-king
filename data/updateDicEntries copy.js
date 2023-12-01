const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const DicEntry = require('../models/dicEntryModel');

dotenv.config({ path: './config.env' });

//CONNECTING TO MONGOOSE
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
console.log(DB);
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

//READ CSV FILE AND CONVERT TO JSON
const string = fs.readFileSync(
  'data/DicEntries(RatedSorted).csv',
  'utf8',
);
const array = string
  .split('\n')
  .map((row) => row.split(','));

const updateDicEntries = async () => {
  await array.forEach(async (row) => {
    await DicEntry.findOneAndUpdate(
      { _id: row[0] },
      {
        rating: row[3],
        rank: row[4],
      },
    );
  });
  console.log('All done!');
};

updateDicEntries();
