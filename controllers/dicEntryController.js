const DicEntry = require('../models/dicEntryModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAll = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  const features = new APIFeatures(
    DicEntry.find(),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const dicEntries = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: dicEntries.length,
    data: {
      dicEntries,
    },
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const dicEntry = await DicEntry.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      dicEntry,
    },
  });
  next();
});

exports.getOne = catchAsync(async (req, res, next) => {
  const dicEntry = await DicEntry.findById(req.params.id);
  // DicEntry.findOne({ _id: req.params.id });

  if (!dicEntry) {
    return next(
      new AppError('No dictionary entry with that ID', 404),
    );
  }
  res.status(201).json({
    status: 'success',
    data: {
      dicEntry,
    },
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const dicEntry = await DicEntry.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!dicEntry) {
    return next(
      new AppError('No dictionary entry with that ID', 404),
    );
  }
  res.status(201).json({
    status: 'success',
    data: {
      dicEntry,
    },
  });
  next();
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  await DicEntry.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
  next();
});
