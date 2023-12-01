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

const updateRanks = async () => {
  try {
    let data = await DicEntry.find();
    data = data.sort((a, b) => a.rating - b.rating);
    for (let i = 0; i < data.length; ++i) {
      data[i].rank = i + 1;
    }

    await data.forEach(async (row) => {
      await DicEntry.findOneAndUpdate(
        { _id: row._id },
        { rank: row.rank },
      );
    });

    console.log('We did it!');
  } catch (err) {
    console.log(err);
  }
};

updateRanks();

// const updateDicEntries = async () => {
//   await array.forEach(async (row) => {
//     await DicEntry.findOneAndUpdate(
//       { _id: row[0] },
//       {
//         rating: row[3],
//         rank: row[4],
//       },
//     );
//   });
//   console.log('All done!');
// };

// updateDicEntries();
