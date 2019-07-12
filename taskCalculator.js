var fs = require("fs");

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1
}

function taskCalculator(batch) {
  fs.writeFile("temp.txt", JSON.stringify(batch), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });

  return {}
}

module.exports = {
  taskCalculator,
}
