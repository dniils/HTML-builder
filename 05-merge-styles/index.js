const fs = require("fs");
const path = require("node:path");

const stylesFolderPath = path.join(__dirname, "styles");
const bundleFilePath = path.join(__dirname, "project-dist/bundle.css");

const bundleFilePathArr = bundleFilePath.split("\\");
const successMessage = `✨ Success! .../${
  bundleFilePathArr[bundleFilePathArr.length - 2]
}/${bundleFilePathArr[bundleFilePathArr.length - 1]} created`;

fs.readdir(stylesFolderPath, (err, files) => {
  if (err) {
    return console.error(`❌ Error: can't read folder | ${err.message}`);
  }

  const cssFiles = files.filter((file) => path.extname(file) === ".css");

  let cssBundleData = "";
  let filesRead = 0;

  cssFiles.forEach((file) => {
    fs.readFile(path.join(stylesFolderPath, file), "utf-8", (err, data) => {
      if (err) {
        console.error(`❌ Error: can't read ${file} | ${err.message}`);
        return;
      }

      cssBundleData += data + "\n";
      filesRead++;

      if (filesRead === cssFiles.length) {
        fs.writeFile(bundleFilePath, cssBundleData, (err) => {
          if (err) {
            return console.error(`❌ Error: can't write file | ${err.message}`);
          }
          console.log(successMessage);
        });
      }
    });
  });
});
