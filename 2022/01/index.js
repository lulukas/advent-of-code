import fs from "fs";
import readline from "readline";

export const getHighestCalorieCount = (filePath) =>
  new Promise((resolve) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Treat CRLF (\r\n) as a single line break
    });

    let highestCalorieCount = 0;
    let currentCalorieCount = 0;

    rl.on("line", (line) => {
      if (line === "") {
        highestCalorieCount = Math.max(
          currentCalorieCount,
          highestCalorieCount
        );

        console.log(
          "Highest:",
          highestCalorieCount,
          "current:",
          currentCalorieCount
        );

        currentCalorieCount = 0;
      } else {
        currentCalorieCount += +line;
      }
    });

    rl.on("close", () => {
      resolve(highestCalorieCount);
    });
  });

export const getHighestCalorieCounts = (filePath) =>
  new Promise((resolve) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Treat CRLF (\r\n) as a single line break
    });

    let highestCalorieCounts = [];
    let currentCalorieCount = 0;

    rl.on("line", (line) => {
      if (line === "") {
        highestCalorieCounts.push(currentCalorieCount);
        highestCalorieCounts.sort((a, b) => b - a);
        highestCalorieCounts.splice(3);
        console.log(
          "🚀 ~ file: index.js:53 ~ rl.on ~ highestCalorieCounts:",
          highestCalorieCounts
        );
        currentCalorieCount = 0;
      } else {
        currentCalorieCount += +line;
      }
    });

    rl.on("close", () => {
      resolve(highestCalorieCounts.reduce((pv, cv) => pv + cv, 0));
    });
  });
