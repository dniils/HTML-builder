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

    fs.readdir(newFolder, { withFileTypes: true }, (err, filesCopy) => {
      if (err) {
        return console.error(`Error: can't read folder: ${err.message}`);
      }

      filesCopy.forEach((fileCopy) => {
        if (fileCopy.isFile()) {
          const fileCopyPath = path.join(newFolder, fileCopy.name);
          const fileInFolderToCopyPath = path.join(folderToCopy, fileCopy.name);

          fs.stat(fileInFolderToCopyPath, (err, stats) => {
            if (err) {
              // if file is not present in folderToCopy, delete it from newFolder
              if (err.code === "ENOENT") {
                fs.unlink(fileCopyPath, (err) => {
                  if (err) {
                    return console.error(
                      `Error: can't delete file ${fileCopyPath}: ${err.message}`
                    );
                  }

                  console.log(`[...${fileCopyPath.slice(-25)}] is deleted`);
                });
              } else {
                console.error(
                  `Error: can't check file ${fileInFolderToCopyPath}: ${err.message}`
                );
              }
            }
          });
        }
      });
    });
  });
});
