const DicEntry = require('../models/dicEntryModel');
const catchAsync = require('../utils/catchAsync');

exports.getAll = catchAsync(async (req, res) => {
  //BUILD QUERY
  const queryObj = { ...req.query };
  const excludedFields = [
    'page',
    'sort',
    'limit',
    'fields',
  ];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`,
  );

  let query = DicEntry.find(JSON.parse(queryStr));
  // add sorting funcitonality:
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-rank');
  }
  // field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');

    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numDicEntries = await DicEntry.countDocuments();
    if (skip > numDicEntries)
      throw new Error('This page does not exist');
  }

  //EXECUTE QUERY
  const dicEntries = await query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: dicEntries.length,
    data: {
      dicEntries,
    },
  });
});

exports.createOne = catchAsync(async (req, res) => {
  const dicEntry = await DicEntry.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      dicEntry,
    },
  });
});

exports.getOne = catchAsync(async (req, res) => {
  const dicEntry = await DicEntry.findById(req.params.id);
  // DicEntry.findOne({ _id: req.params.id });
  res.status(201).json({
    status: 'success',
    data: {
      dicEntry,
    },
  });
});

exports.updateOne = catchAsync(async (req, res) => {
  const dicEntry = await DicEntry.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(201).json({
    status: 'success',
    data: {
      dicEntry,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res) => {
  await DicEntry.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
