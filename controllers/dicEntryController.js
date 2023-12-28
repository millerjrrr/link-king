const {
  selectorDicEntry,
} = require('../utils/dictionarySelectors');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = catchAsync(async (req, res, next) => {
  const DicEntry = selectorDicEntry(
    req.user.language.dictionary,
  );

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
