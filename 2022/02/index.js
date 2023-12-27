import fs from "fs";
import readline from "readline";

export const getTotalScoreStrategy1 = (filePath) =>
  new Promise((resolve) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Treat CRLF (\r\n) as a single line break
    });

    const lineScore = {
      "A X": 4,
      "A Y": 8,
      "A Z": 3,
      "B X": 1,
      "B Y": 5,
      "B Z": 9,
      "C X": 7,
      "C Y": 2,
      "C Z": 6,
    };

    let totalScore = 0;

    rl.on("line", (line) => {
      totalScore += lineScore[line];
    });

    rl.on("close", () => {
      resolve(totalScore);
    });
  });

export const getTotalScoreStrategy2 = (filePath) =>
  new Promise((resolve) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Treat CRLF (\r\n) as a single line break
    });

    const lineScore = {
      "A X": 3,
      "A Y": 4,
      "A Z": 8,
      "B X": 1,
      "B Y": 5,
      "B Z": 9,
      "C X": 2,
      "C Y": 6,
      "C Z": 7,
    };

    let totalScore = 0;

    rl.on("line", (line) => {
      totalScore += lineScore[line];
    });

    rl.on("close", () => {
      resolve(totalScore);
    });
  });
