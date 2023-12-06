const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const GameData = require('../models/gameDataModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) =>
  jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    },
  );

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES *
          24 *
          60 *
          60 *
          1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production')
    cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  GameData.create({
    user: user._id,
    dueToday: [],
    repeats: [],
    index: 0,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(user, url).sendWelcome();

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(
      new AppError('Please provide email and password'),
    );

  const user = await User.findOne({ email }).select(
    '+password',
  );

  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(
      new AppError('Incorrect email or password', 401),
    );
  }

  createSendToken(user, 201, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        401,
      ),
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token no longer exists',
        401,
      ),
    );
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed password! Please log in again!',
        401,
      ),
    );
  }

  // Grant access to protected route
  req.user = freshUser;
  next();
});

// Important not to use CatchAsync here
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat))
        return next();

      // There is a logged in user
      res.locals.user = currentUser; // passes the user to the pug templates
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.forgotPassword = catchAsync(
  async (req, res, next) => {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user)
      return next(
        new AppError(
          'There is no user with that email address',
          404,
        ),
      );

    if (
      user.passwordResetToken &&
      user.passwordResetExpires > Date.now()
    )
      return next(
        new AppError(
          'The code has already been sent. Check your spam, check you email and if that does not work try again later',
          404,
        ),
      );

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      const resetURL = `${req.protocol}://${req.get(
        'host',
      )}/api/v1/users/resetPassword/${resetToken}`;
      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending the email, try again later',
          500,
        ),
      );
    }
  },
);

exports.resetPassword = catchAsync(
  async (req, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.body.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
      return next(
        new AppError('Token is invalid or expired', 400),
      );
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user._id, 200, res);
  },
);
