const fs = require('fs');
const R = require('ramda');

const DATA = "./data/20221.txt";

const elves = R.pipe(
  R.partialRight(fs.readFileSync, ["utf8"]),
  R.trim,
  R.split('\n'),
  R.map(parseInt),
  R.splitWhenever(R.equals(NaN)),
)(DATA);

// part 1
R.pipe(
  R.map(R.sum),
  (data) => Math.max(...data),
  console.log,
)(elves);

// part 2
R.pipe(
  R.map(R.sum),
  R.sort((a, b) => (b - a)),
  R.take(3),
  R.sum,
  console.log,
)(elves);