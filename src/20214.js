const fs = require("fs");
const R = require("ramda");

const BINGO_DATA = "../data/20214.txt";

class BingoCard {
  constructor(cardData) {
    this.card = R.map(BingoCard.formatBingoCardRow, cardData);
    this.winningDrawnNumber = undefined;
  }

  get winningScore() {
    if (this.winningDrawnNumber === undefined) {
      return undefined;
    }

    const unmarkedValues = R.map(
      this.convertUnmarkedRowValuesToNumbers,
      this.card
    );

    return R.multiply(
      this.winningDrawnNumber,
      R.sum(R.flatten(unmarkedValues))
    );
  }

  markDrawnNumber(drawnNumber) {
    this.card.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        if (column === drawnNumber) {
          this.card[rowIndex][columnIndex] = Number(drawnNumber);
        }
      });
    });

    this.card.forEach((row, rowIndex) => {
      if (this.allValuesInRowAreNumbers(rowIndex)) {
        this.winningDrawnNumber = drawnNumber;
        return;
      }

      row.forEach((column, columnIndex) => {
        if (this.allValuesInColumnAreNumbers(columnIndex)) {
          this.winningDrawnNumber = drawnNumber;
          return;
        }
      });
    });
  }

  allValuesInRowAreNumbers(rowIndex) {
    return this.allValuesAreNumbers(this.card[rowIndex]);
  }

  allValuesInColumnAreNumbers(columnIndex) {
    return this.allValuesAreNumbers(R.transpose(this.card)[columnIndex]);
  }

  static formatBingoCardRow = R.pipe(
    R.replace(/\s+/g, ","),
    R.replace(/^,/, ""),
    R.split(",")
  );

  convertUnmarkedRowValuesToNumbers = R.pipe(
    R.filter(R.is(String)),
    R.map(parseInt)
  );

  allValuesAreNumbers = R.all(R.is(Number));
}

const processFileIntoDrawnNumbersAndBingoCards = [
  R.partialRight(fs.readFileSync, ["utf8"]),
  R.trim,
  R.split("\n"),
  R.filter((e) => e !== ""),
  ([drawnNumbers, ...bingoCards]) => {
    return {
      drawnNumbers: R.split(",", drawnNumbers),
      bingoCards: R.map(R.construct(BingoCard), R.splitEvery(5, bingoCards)),
    };
  },
];

const printScoreOfWinningCard = (findWinningCardFn) =>
  R.pipe(
    ...processFileIntoDrawnNumbersAndBingoCards,
    findWinningCardFn,
    (card) => card.winningScore,
    console.log
  );

printScoreOfWinningCard(({ drawnNumbers, bingoCards }) => {
  try {
    drawnNumbers.forEach((drawnNumber) => {
      bingoCards.forEach((bingoCard) => {
        bingoCard.markDrawnNumber(drawnNumber);

        if (bingoCard.winningScore) {
          throw bingoCard;
        }
      });
    });
  } catch (bingoCard) {
    return bingoCard;
  }
})(BINGO_DATA);

printScoreOfWinningCard(({ drawnNumbers, bingoCards }) => {
  let winningCards = [];
  let notYetWinningCards = bingoCards.slice();

  const cardStillHasNotWon = (card) => !R.includes(card, winningCards);

  drawnNumbers.forEach((drawnNumber) => {
    notYetWinningCards.forEach((bingoCard) => {
      bingoCard.markDrawnNumber(drawnNumber);

      if (bingoCard.winningScore) {
        winningCards.push(bingoCard);
      }
    });

    notYetWinningCards = R.filter(cardStillHasNotWon, notYetWinningCards);
  });

  return R.last(winningCards);
})(BINGO_DATA);
