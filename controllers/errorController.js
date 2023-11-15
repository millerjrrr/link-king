const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}: Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(
    (el) => el.message,
  );
  const message = `Invalid input data.${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = () =>
  new AppError(
    'Your token has expired! Please log in again',
    401,
  );

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      err: err,
      msg: err.message,
      stack: err.stack,
    });
  } else {
    // RENDERED WEBSITE
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      //Operational trusted error: send message to client
      return res.status(err.statusCode).json({
        status: err.status,
        msg: err.message,
      });
      //Programming or other unknown error: don't leak error details to client
    }
    // 1) Log error
    console.error('Error ‼️', err);

    // 2) Send generic message
    return res.status(500).render({
      status: 'error',
      msg: 'Something went very wrong!',
    });
  }
  // B) RENDERED WEBSITE
  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
    //Programming or other unknown error: don't leak error details to client
  } else {
    // 1) Log error
    console.error('Error ‼️', err);

    // 2) Send generic message
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.',
    });
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError')
      sendErrorProd(handleCastErrorDB(err), req, res);
    else if (err.code === 11000)
      sendErrorProd(handleDuplicateFieldsDB(err), req, res);
    else if (err.name === 'ValidationError')
      sendErrorProd(handleValidationErrorDB(err), req, res);
    else if (err.name === 'JsonWebTokenError')
      sendErrorProd(handleJWTError(), req, res);
    else if (err.name === 'TokenExpiredError')
      sendErrorProd(handleJWTExpiredError(), req, res);
    else sendErrorProd(err, req, res);
  }
};
