exports.winner = (winner, loser, k) => {
  const c = 400;
  const qa = Math.pow(10, winner / c);
  const qb = Math.pow(10, loser / c);
  const ea = qa / (qa + qb);
  return winner + k * (1 - ea);
};

exports.loser = (winner, loser, k) => {
  const c = 400;
  const qa = Math.pow(10, loser / c);
  const qb = Math.pow(10, winner / c);
  const ea = qa / (qa + qb);
  return loser + k * (0 - ea);
};
