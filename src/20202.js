const fs = require("fs");
const R = require("ramda");

class PasswordValidation {
  constructor(line) {
    const [policy, password] = line.split(": ");
    const [counts, char] = policy.split(" ");
    const [min, max] = counts.split("-");
    this.password = password.split("");
    this.min = Number(min);
    this.max = Number(max);
    this.char = char;
  }

  get validForPartOne() {
    const countOfCheckChar = R.reduce(
      (acc, next) => {
        const increment = next === this.char ? 1 : 0;
        return acc + increment;
      },
      0,
      this.password
    );

    return countOfCheckChar >= this.min && countOfCheckChar <= this.max;
  }

  get validForPartTwo() {
    const atMin = this.password[this.min - 1] === this.char;
    const atMax = this.password[this.max - 1] === this.char;
    return atMin ^ atMax;
  }
}

const passwords = fs
  .readFileSync("../data/20202.txt", "utf8")
  .split("\n")
  .filter((e) => e.length)
  .map((line) => new PasswordValidation(line));

const solve = (testFn) => R.pipe(R.filter(testFn), R.length, console.log);

const solvePartOne = solve((p) => p.validForPartOne);
const solvePartTwo = solve((p) => p.validForPartTwo);
solvePartOne(passwords);
solvePartTwo(passwords);
