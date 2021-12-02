const fs = require("fs");
const R = require("ramda");

const INSTRUCTIONS = "../data/20212.txt";
const FORWARD = "forward";
const DOWN = "down";
const UP = "up";

class Instruction {
  constructor(s) {
    const [direction, count] = R.split(" ", s);
    this.direction = direction;
    this.count = Number(count);
  }
}

const calculateHorizontalPositionAndDepth = (reducer) =>
  R.pipe(
    R.partialRight(fs.readFileSync, ["utf8"]),
    R.split("\n"),
    R.map(R.construct(Instruction)),
    reducer,
    R.dissoc("aim"),
    R.values,
    R.reduce(R.multiply, 1),
    console.log
  );

calculateHorizontalPositionAndDepth(
  R.reduce(
    ({ horizontal, depth }, instruction) => {
      switch (instruction.direction) {
        case FORWARD:
          return { horizontal: horizontal + instruction.count, depth };
        case UP:
          return { depth: depth - instruction.count, horizontal };
        case DOWN:
          return { horizontal, depth: depth + instruction.count };
        default:
          return { horizontal, depth };
      }
    },
    { horizontal: 0, depth: 0 }
  )
)(INSTRUCTIONS);

calculateHorizontalPositionAndDepth(
  R.reduce(
    ({ horizontal, depth, aim }, instruction) => {
      switch (instruction.direction) {
        case DOWN:
          return { horizontal, depth, aim: aim + instruction.count };
        case UP:
          return { horizontal, depth, aim: aim - instruction.count };
        case FORWARD:
          return {
            aim,
            horizontal: horizontal + instruction.count,
            depth: depth + aim * instruction.count,
          };
        default:
          return { horizontal, depth, aim };
      }
    },
    { horizontal: 0, depth: 0, aim: 0 }
  )
)(INSTRUCTIONS);
