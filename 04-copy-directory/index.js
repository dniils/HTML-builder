const fs = require("fs");
const path = require("node:path");

const folderToCopy = path.join(__dirname, "files");
const newFolder = path.join(__dirname, "files-copy");

fs.mkdir(newFolder, { recursive: true }, (err) => {
  if (err) {
    return console.error(`Error: can't create folder: ${err.message}`);
  }

  fs.readdir(folderToCopy, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.error(`Error: can't read folder: ${err.message}`);
    }

    files.forEach((file) => {
      if (file.isFile()) {
        const fileToCopy = path.join(folderToCopy, file.name);
        const newFile = path.join(newFolder, file.name);

        fs.copyFile(fileToCopy, newFile, (err) => {
          if (err) {
            return console.error(
              `Error: can't copy file ${fileToCopy}: ${err.message}`
            );
          }

          console.log(
            `[...${fileToCopy.slice(-25)}] is copied to [...${newFile.slice(
              -25
            )}]`
          );
        });
      }
    });
  });
});
