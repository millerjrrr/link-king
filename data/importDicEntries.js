const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {
  DicEntryBrazil,
} = require('../models/dicEntryModel');

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
  'data/brazilDictionary.csv',
  'utf8',
);
const array = string
  .split('\n')
  .map((row) => row.split(','));
const list = [];
array.forEach((row) => {
  if (row[1].includes(';', 0) && !row[1].includes('; ', 0))
    throw new Error(
      'One or more values in the solution column are incorrectly formatted. All entries ' +
        'in the solutions column should be separated by "; " and not just ";"',
    );
  list.push({
    target: row[0],
    solutions: row[1].split('; '),
    rank: row[2],
    rating: row[3],
  });
});

const importData = async () => {
  let DicEntry = DicEntryBrazil;
  try {
    await DicEntry.create(list);
    console.log('Data successfully created!');
  } catch (err) {
    console.log(err);
  }
};

importData();
