const jStat = require('jstat');
const calculateEloRating = require('./consoleGamePlayFunctions/calculateEloRating');

let rating = 1200,
  dicWord = 600,
  kfactor = 50;
const newUserRating = calculateEloRating.winner(
  rating,
  dicWord,
  kfactor,
); //rating management
const kfactord = kfactor === 20 ? 20 : kfactor - 1; //rating management

// New DicWord by Rating
const dictionarySize = 3173; //NEEDS TO BE MAINTAINED
let lookUpRank = Math.floor(
  jStat.normal.cdf(newUserRating, 1200, 400) *
    dictionarySize -
    50 +
    Math.random() * 100,
);

console.log(newUserRating);

lookUpRank = lookUpRank < 0 ? 0 : lookUpRank;
lookUpRank =
  lookUpRank > dictionarySize ? dictionarySize : lookUpRank;

console.log(lookUpRank);
