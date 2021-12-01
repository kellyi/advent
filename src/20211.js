const fs = require("fs");
const R = require("ramda");

const measurements = R.pipe(
  R.partialRight(fs.readFileSync, ["utf8"]),
  R.split("\n"),
  R.map(Number)
)("../data/20211.txt");

const countIncreases = R.pipe(
  R.reduce(
    ([counter, prior], current) => [counter + Number(prior < current), current],
    [0, undefined]
  ),
  R.head,
  console.log
);

const countWindowIncreases = R.pipe(
  R.aperture(3),
  R.map(R.sum),
  countIncreases
);

countIncreases(measurements);
countWindowIncreases(measurements);
