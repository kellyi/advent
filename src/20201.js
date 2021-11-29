const fs = require("fs");
const R = require("ramda");
const percom = require("percom");

const numbers = fs
  .readFileSync("../data/20201.txt", "utf8")
  .split("\n")
  .map(Number);

const findProductOfNValuesSummingToTarget = (n, targetValue = 2020) =>
  R.pipe(
    R.flip(percom.com)(n),
    R.filter((l) => R.sum(l) === targetValue),
    R.reject(R.contains(0)),
    R.last,
    R.reduce(R.multiply, 1),
    console.log
  );

findProductOfNValuesSummingToTarget(2)(numbers);
findProductOfNValuesSummingToTarget(3)(numbers);
