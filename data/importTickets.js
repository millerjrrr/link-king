const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ticket = require('../models/ticketModel');
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

// Set User ID (my ID)
const userID = '65529fb7fa4015bc0eefce82';

//READ CSV FILE AND CONVERT TO JSON
const string = fs.readFileSync(process.argv[2], 'utf8');
const array = string
  .split('\n')
  .map((row) => row.split(','));

const createList = async () => {
  const promises = array.map(async (row) => {
    const dicID = await DicEntry.findOne({
      target: row[0],
    });
    // console.log(dicID._id, row[0]);
    return {
      user: userID,
      dicEntry: dicID._id,
      level: row[2].substring(0, 1),
      dueDate: row[1],
    };
  });

  return Promise.all(promises);
};

const importData = async (list) => {
  try {
    await Ticket.create(list);
  } catch (err) {
    console.log(err);
  }
};

createList()
  .then((list) => {
    importData(list);
  })
  .catch((err) => {
    console.error(err);
  });
