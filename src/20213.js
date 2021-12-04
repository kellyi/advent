const fs = require("fs");
const R = require("ramda");

const ZERO = "0";
const ONE = "1";

const BINARY_NUMBERS = "../data/20213.txt";

const integerFromBinaryString = R.partialRight(parseInt, [2]);
const countOccurrences = R.countBy(R.identity);
const onesComplement = (s) =>
  s.replace(/[01]/g, (m) => (m == ZERO ? ONE : ZERO));

const processFile = [
  R.partialRight(fs.readFileSync, ["utf8"]),
  R.trim,
  R.split("\n"),
  R.map(R.split("")),
];

const multiplyAndPrintResultsInBaseTen = [
  R.map(integerFromBinaryString),
  ([x, y]) => x * y,
  console.log,
];

const findGammaAndEpsilonRates = [
  R.transpose,
  R.map(countOccurrences),
  R.reduce(
    (acc, next) => R.concat(acc, next[ZERO] > next[ONE] ? ZERO : ONE),
    ""
  ),
  (n) => [n, onesComplement(n)],
];

const findLifeSupportRatings = (binaryNumbers) => {
  let oxygenGeneratorRatings = binaryNumbers.slice();
  let coTwoScrubberRatings = binaryNumbers.slice();

  R.head(binaryNumbers).forEach((_, index) => {
    const oxygenRatingsTransposed = R.map(
      countOccurrences,
      R.transpose(oxygenGeneratorRatings)
    );

    const coTwoRatingsTransposed = R.map(
      countOccurrences,
      R.transpose(coTwoScrubberRatings)
    );

    const oxygenColumn = oxygenRatingsTransposed[index];
    const coTwoColumn = coTwoRatingsTransposed[index];
    const valueAtIndexIsZero = (e) => e[index] === ZERO;
    const valueAtIndexIsOne = (e) => e[index] === ONE;

    if (oxygenGeneratorRatings.length > 1) {
      if (oxygenColumn[ZERO] > oxygenColumn[ONE]) {
        oxygenGeneratorRatings = R.filter(
          valueAtIndexIsZero,
          oxygenGeneratorRatings
        );
      } else {
        oxygenGeneratorRatings = R.filter(
          valueAtIndexIsOne,
          oxygenGeneratorRatings
        );
      }
    }

    if (coTwoScrubberRatings.length > 1) {
      if (coTwoColumn[ZERO] > coTwoColumn[ONE]) {
        coTwoScrubberRatings = R.filter(
          valueAtIndexIsOne,
          coTwoScrubberRatings
        );
      } else {
        coTwoScrubberRatings = R.filter(
          valueAtIndexIsZero,
          coTwoScrubberRatings
        );
      }
    }
  });

  return [
    R.join("", R.head(oxygenGeneratorRatings)),
    R.join("", R.head(coTwoScrubberRatings)),
  ];
};

const calculatePowerConsumption = R.pipe(
  ...processFile,
  ...findGammaAndEpsilonRates,
  ...multiplyAndPrintResultsInBaseTen
);

const calculateLifeSupportRating = R.pipe(
  ...processFile,
  findLifeSupportRatings,
  ...multiplyAndPrintResultsInBaseTen
);

calculatePowerConsumption(BINARY_NUMBERS);
calculateLifeSupportRating(BINARY_NUMBERS);
