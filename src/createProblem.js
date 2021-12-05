const fs = require("fs");
const { ArgumentParser } = require("argparse");

const parser = new ArgumentParser({
  description: "Create data and solution files for problem",
  add_help: false,
});

parser.add_argument("-p", "--problem", { help: "problem filename" });

const { problem: problemNumber } = parser.parse_args();

const problemFileName = `src/${problemNumber}.js`;
const dataFileName = `data/${problemNumber}.txt`;
const testDataFileName = `data/${problemNumber}.test.txt`;

if (
  fs.existsSync(problemFileName) ||
  fs.existsSync(dataFileName) ||
  fs.existsSync(testDataFileName)
) {
  console.error(`files already exist for problem ${problemNumber}`);
  process.exit(1);
}

fs.writeFileSync(
  problemFileName,
  `const fs = require('fs');
const R = require('ramda');

const DATA = "../${dataFileName}";

R.pipe(
  R.partialRight(fs.readFileSync, ["utf8"]),
  R.trim,
  console.log
)(DATA);`
);
fs.writeFileSync(dataFileName, "hello");
fs.writeFileSync(testDataFileName, "hello");
