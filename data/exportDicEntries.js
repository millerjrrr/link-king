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
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

const exportData = async () => {
  try {
    return await DicEntry.find();
  } catch (err) {
    console.log(err);
  }
};

exportData().then((res) => {
  let list = '';
  res.forEach((row) => {
    list +=
      row._id +
      ',' +
      row.target +
      ',' +
      row.solutions.join('; ') +
      ',' +
      row.rating +
      ',' +
      row.rank +
      ',' +
      row.visits +
      '\n';
  });

  fs.writeFile(
    'DicEntries(Exported).csv',
    list.slice(0, -1),
    (err) => {
      if (err) console.log(`Failed to write file: ${err}`);
      else console.log('Export successful');
    },
  );
});
