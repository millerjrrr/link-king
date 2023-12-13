const path = require('path');
const express = require('express');
const morgan = require('morgan');

// Security modules (to prevent attacks)
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const DOMPurify = require('dompurify');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
// ------------------------------------------------------

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const dicRouter = require('./routes/dicEntryRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const gameDataRouter = require('./routes/gameDataRoutes');
const ticketRouter = require('./routes/ticketRoutes');

const app = express();

// Setting the views engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https://js.stripe.com/'],
      scriptSrc: [
        "'self'",
        'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js',
        'https://js.stripe.com/',
      ],
    },
  }),
);

if (process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));
// This^^middleware gives us information about requests in the console
// GET /api/v1/pt-en-dictionary/45 200 5.681 ms - 20

//Limit the amount of requests to stop someone trying to overload our server
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests from this IP, please try again in one hour',
});
app.use('/api', limiter);

// Body parser: reads data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (Cross Site Scripting Attacks)
app.use((req, res, next) => {
  if (req.body && req.body.userInput) {
    req.body.userInput = DOMPurify.sanitize(
      req.body.userInput,
    );
  }
  next();
});

// Prevent parameter pollution
app.use(hpp());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(compression());

// ROUTES
app.use('/', viewRouter);

app.use('/api/v1/gameData', gameDataRouter);
app.use('/api/v1/dictionary', dicRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tickets', ticketRouter);

// handling requests to unassigned urls
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404,
    ),
  );
});

app.use(globalErrorHandler);

module.exports = app;
