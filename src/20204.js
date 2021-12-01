const fs = require("fs");
const R = require("ramda");

class Passport {
  constructor(opts) {
    this.byr = Number(opts["byr"]);
    this.iyr = Number(opts["iyr"]);
    this.eyr = Number(opts["eyr"]);
    this.hgt = opts["hgt"];
    this.hcl = opts["hcl"];
    this.ecl = opts["ecl"];
    this.pid = opts["pid"];
    this.cid = opts["cid"];
  }

  static fromString = R.pipe(
    R.split(" "),
    R.chain(R.split("\n")),
    R.map(R.split(":")),
    R.fromPairs,
    R.construct(Passport)
  );

  get validForPartOne() {
    return (
      this.byr &&
      this.iyr &&
      this.eyr &&
      this.hgt &&
      this.hcl &&
      this.ecl &&
      this.pid
    );
  }

  get validForPartTwo() {
    return (
      this.validForPartOne &&
      this.byrValid &&
      this.iyrValid &&
      this.eyrValid &&
      this.hgtValid &&
      this.hclValid &&
      this.eclValid &&
      this.pidValid
    );
  }

  get byrValid() {
    return R.both(R.gte(R.__, 1920), R.lte(R.__, 2002))(this.byr);
  }

  get iyrValid() {
    return R.both(R.gte(R.__, 2010), R.lte(R.__, 2020))(this.iyr);
  }

  get eyrValid() {
    return R.both(R.gte(R.__, 2020), R.lte(R.__, 2030))(this.eyr);
  }

  get hgtValid() {
    const [value, unit] = R.splitAt(-2, this.hgt);

    if (unit === "cm") {
      return value >= 150 && value <= 193;
    } else if (unit === "in") {
      return value >= 59 && value <= 76;
    }

    return false;
  }

  get hclValid() {
    const [prefix, chars] = R.splitAt(1, this.hcl);
    return prefix === "#" && chars.replace(/[^a-f0-9]/g, "").length === 6;
  }

  get eclValid() {
    return R.includes(this.ecl, [
      "amb",
      "blu",
      "brn",
      "gry",
      "grn",
      "hzl",
      "oth",
    ]);
  }

  get pidValid() {
    return this.pid.replace(/[^0-9]/g, "").length === 9;
  }
}

const passportData = R.pipe(
  R.partialRight(fs.readFileSync, ["utf8"]),
  R.split("\n\n"),
  R.map(Passport.fromString)
)("../data/20204.txt");

const validatePassport = (validationFn) =>
  R.pipe(R.filter(validationFn), R.length, console.log);

validatePassport((p) => p.validForPartOne)(passportData);
validatePassport((p) => p.validForPartTwo)(passportData);
