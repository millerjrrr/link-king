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
const string = fs.readFileSync(process.argv[2], 'utf8');
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
    dictionaryName: row[4],
  });
});

console.log(JSON.stringify(list.slice(1)));

const importData = async () => {
  try {
    await DicEntry.create(list.slice(1));
  } catch (err) {
    console.log(err);
  }
};

// //  DELETE ALL DATA FROM DB
// const deleteData = async () => {
//   try {
//     await DicEntry.deleteMany();
//     console.log('Data successfully deleted!');
//   } catch (err) {
//     console.log(err);
//   }
// };

// deleteData();
importData();
