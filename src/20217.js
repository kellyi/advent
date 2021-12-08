const fs = require("fs");
const R = require("ramda");

const DATA = "../data/20217.txt";

const getPositionsCount = R.pipe(R.values, R.sum, R.inc);

const createPositionsArray = (count) =>
  new Array(count).fill().map((_, index) => index);

const createPositionsArrayFromObject = R.pipe(
  getPositionsCount,
  createPositionsArray
);

const createCountObject = (count, position, obj) => ({
  position: Number(position),
  count,
  positions: createPositionsArrayFromObject(obj),
});

const printFuelCosts = (findFuelCostsFn) =>
  R.pipe(
    R.partialRight(fs.readFileSync, ["utf8"]),
    R.trim,
    R.split(","),
    R.map(Number),
    R.countBy(R.identity),
    R.mapObjIndexed(createCountObject),
    R.values,
    findFuelCostsFn,
    R.map(({ positions }) => positions),
    R.transpose,
    R.map(R.sum),
    R.sortBy(R.identity),
    R.head,
    console.log
  );

const findFuelCostsForPartOne = R.map(({ position, count, positions }) => ({
  position,
  count,
  positions: R.map(
    (index) => (index === 0 ? Infinity : Math.abs(position - index)) * count,
    positions
  ),
}));

const findFuelCostsForPartTwo = R.map(({ position, count, positions }) => ({
  position,
  count,
  positions: R.map((index) => {
    if (index === 0) {
      return Infinity;
    }

    const calculateFuelForStep = R.pipe(
      (v) => v * (v + 1),
      R.divide(R.__, 2),
      Math.floor
    );

    const distance = Math.abs(position - index);

    return count * calculateFuelForStep(distance);
  }, positions),
}));

printFuelCosts(findFuelCostsForPartOne)(DATA);
printFuelCosts(findFuelCostsForPartTwo)(DATA);

module.exports = {
  findFuelCostsForPartTwo,
};
