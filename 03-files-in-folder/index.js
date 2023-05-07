const fs = require("fs");
const path = require("node:path");

const folderPath = path.join(__dirname, "secret-folder");

function formatFileName(name, size) {
  const [fileName, fileExt] = name.split(".");
  return `${fileName} - ${fileExt} - ${size / 1024}kb`;
}

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) return console.log("Error reading directory: " + err.message);

  files.forEach((file) => {
    if (!file.isDirectory()) {
      fs.stat(`${folderPath}/${file.name}`, (err, stats) => {
        if (err) return console.log(`Error getting file stats: ${err.message}`);
        console.log(formatFileName(file.name, stats.size));
      });
    }
  });
});
