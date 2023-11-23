const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ticket = require('./models/ticketModel');

dotenv.config({ path: './config.env' });
// It is important that this^^comes before requiring the app
const app = require('./app');

// Handling uncaught exceptions/errors
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err);
  process.exit(1);
});

//CONNECTING TO MONGOOSE
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

const update = async () => {
  let increase = Math.round(Math.random() * 7);
  return await Ticket.findOneAndUpdate(
    { dueDate: { $lte: 45253 } },
    [
      {
        $set: {
          dueDate: {
            $add: ['$dueDate', increase],
          },
        },
      },
    ],
    {
      runValidators: true,
    },
  );
};

for (i = 1; i <= 145; ++i) update();
