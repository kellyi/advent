const fs = require("fs");
const R = require("ramda");

const LANTERNFISH = "../data/20216.txt";

const printLanternFishCountOnDay = (day) =>
  R.pipe(
    R.partialRight(fs.readFileSync, ["utf8"]),
    R.trim,
    R.split(","),
    R.countBy(R.identity),
    (fish) => {
      R.range(1, day).forEach((_day) => {
        let newFishSeven = fish["8"] || 0;
        let newFishSix = (fish["7"] || 0) + (fish["0"] || 0);
        let newFishFive = fish["6"] || 0;
        let newFishFour = fish["5"] || 0;
        let newFishThree = fish["4"] || 0;
        let newFishTwo = fish["3"] || 0;
        let newFishOne = fish["2"] || 0;
        let newFishZero = fish["1"] || 0;
        let newFishEight = fish["0"] || 0;

        fish["8"] = newFishEight;
        fish["7"] = newFishSeven;
        fish["6"] = newFishSix;
        fish["5"] = newFishFive;
        fish["4"] = newFishFour;
        fish["3"] = newFishThree;
        fish["2"] = newFishTwo;
        fish["1"] = newFishOne;
        fish["0"] = newFishZero;
      });

      return fish;
    },
    R.values,
    R.sum,
    console.log
  );

printLanternFishCountOnDay(81)(LANTERNFISH);
printLanternFishCountOnDay(257)(LANTERNFISH);
