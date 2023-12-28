const {
  DicEntryPersonal,
  DicEntryBrazil,
} = require('../models/dicEntryModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = catchAsync(async (req, res, next) => {
  let DicEntry;
  if (req.user.language.dictionary === 'Personal')
    DicEntry = DicEntryPersonal;
  else DicEntry = DicEntryBrazil;

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
