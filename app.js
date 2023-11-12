const express = require('express');
const morgan = require('morgan');

const dicRouter = require('./routes/dicEntryRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));
// This^^middleware gives us information about requests in the console
// GET /api/v1/pt-en-dictionary/45 200 5.681 ms - 20

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use('/api/v1/pt-en-dictionary', dicRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
