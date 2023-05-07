const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fileName = "newFile";
const fileExtension = "txt";

let fileText = "";

function writeDataToFile(name, extension, text) {
  fs.writeFile(`./02-write-file/${name}.${extension}`, `${text}`, (err) => {
    if (err) console.log(err.message);
  });
}

writeDataToFile(fileName, fileExtension, fileText);

console.log(
  `Please provide some text for the newly created ${fileName}.${fileExtension} file`
);
rl.prompt();

rl.on("line", (userInput) => {
  if (userInput !== "exit") {
    fileText += userInput;
    writeDataToFile(fileName, fileExtension, fileText);
  } else {
    rl.close();
  }
});

rl.on("close", () =>
  console.log(
    `Goodbye!\nHere is what you have written to ${fileName}.${fileExtension}:\n"${fileText}"`
  )
);
