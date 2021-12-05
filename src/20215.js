const fs = require("fs");
const R = require("ramda");

const LINES = "../data/20215.txt";

class Point {
  constructor(key) {
    const [x, y] = R.split(",", key);
    this.x = Number(x);
    this.y = Number(y);
    this.key = key;
  }

  static fromCoordinates(x, y) {
    return new Point(`${x},${y}`);
  }
}

class Line {
  constructor(s) {
    const [start, end] = R.split(" -> ", s);
    this.start = new Point(start);
    this.end = new Point(end);
    this.pointsCovered = undefined;
  }

  get isHorizontal() {
    return this.start.y === this.end.y;
  }

  get isVertical() {
    return this.start.x === this.end.x;
  }

  get isDiagonal() {
    return !this.isHorizontal || !this.isVertical;
  }

  calculatePoints(includeDiagonalLines) {
    if (this.pointsCovered) {
      return this.pointsCovered;
    }

    this.pointsCovered = [];

    if (this.isVertical) {
      const x = this.start.x;

      R.range(
        R.min(this.start.y, this.end.y),
        R.max(this.start.y, this.end.y) + 1
      ).forEach((y) => {
        this.pointsCovered.push(Point.fromCoordinates(x, y));
      });
    } else if (this.isHorizontal) {
      const y = this.start.y;

      R.range(
        R.min(this.start.x, this.end.x),
        R.max(this.start.x, this.end.x) + 1
      ).forEach((x) => {
        this.pointsCovered.push(Point.fromCoordinates(x, y));
      });
    } else if (includeDiagonalLines && this.isDiagonal) {
      if (this.start.x === this.start.y && this.end.x === this.end.y) {
        R.range(
          R.min(this.start.x, this.end.x),
          R.max(this.start.x, this.end.x) + 1
        ).forEach((coordinate) => {
          this.pointsCovered.push(
            Point.fromCoordinates(coordinate, coordinate)
          );
        });
      } else if (this.start.x === this.end.y && this.start.y === this.end.x) {
        const range = R.range(
          R.min(this.start.x, this.end.x),
          R.max(this.start.x, this.end.x) + 1
        );
        const coordinates = R.zip(range, R.reverse(range));
        coordinates.forEach((xyPair) => {
          this.pointsCovered.push(Point.fromCoordinates(...xyPair));
        });
      } else if (this.start.x < this.end.x && this.start.y > this.end.y) {
        let y = this.start.y;
        R.range(this.start.x, this.end.x + 1).forEach((x) => {
          this.pointsCovered.push(Point.fromCoordinates(x, y));
          y -= 1;
        });
      } else if (this.start.x > this.end.x && this.start.y > this.end.y) {
        let y = this.start.y;
        for (let x = this.start.x; x >= this.end.x; x--) {
          this.pointsCovered.push(Point.fromCoordinates(x, y));
          y -= 1;
        }
      } else if (this.start.x < this.end.x && this.start.y < this.end.y) {
        let y = this.start.y;
        R.range(this.start.x, this.end.x + 1).forEach((x) => {
          this.pointsCovered.push(Point.fromCoordinates(x, y));
          y += 1;
        });
      } else if (this.start.x > this.end.x && this.start.y < this.end.y) {
        let y = this.start.y;
        for (let x = this.start.x; x >= this.end.x; x--) {
          this.pointsCovered.push(Point.fromCoordinates(x, y));
          y += 1;
        }
      }
    }

    return this.pointsCovered;
  }
}

const printCountOfPointsWithOverlappingLines = ({
  includeDiagonalLines = false,
}) =>
  R.pipe(
    R.partialRight(fs.readFileSync, ["utf8"]),
    R.trim,
    R.split("\n"),
    R.map(R.construct(Line)),
    R.reduce((accumulator, nextLine) => {
      nextLine.calculatePoints(includeDiagonalLines);
      nextLine.pointsCovered.forEach((point) => {
        if (accumulator[point.key]) {
          accumulator[point.key] += 1;
        } else {
          accumulator[point.key] = 1;
        }
      });

      return accumulator;
    }, {}),
    R.values,
    R.filter((e) => e > 1),
    (e) => e.length,
    console.log
  );

printCountOfPointsWithOverlappingLines({ includeDiagonalLines: false })(LINES);
printCountOfPointsWithOverlappingLines({ includeDiagonalLines: true })(LINES);
