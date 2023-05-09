const fs = require("fs");
const path = require("node:path");

const distDirPath = path.join(__dirname, "project-dist");
const distDirIndexHtmlPath = path.join(distDirPath, "index.html");
const assetsFontsPath = path.join(__dirname, "assets", "fonts");
const assetsImgPath = path.join(__dirname, "assets", "img");
const assetsSvgPath = path.join(__dirname, "assets", "svg");
const newAssetsFontsPath = path.join(
  __dirname,
  "project-dist",
  "assets",
  "fonts"
);
const newAssetsImgPath = path.join(distDirPath, "assets", "img");
const newAssetsSvgPath = path.join(distDirPath, "assets", "svg");
const stylesPath = path.join(__dirname, "styles");
const bundleFilePath = path.join(distDirPath, "style.css");
const templateHtmlPath = path.join(__dirname, "template.html");
const componentsPath = path.join(__dirname, "components");

function createShortPathString(path) {
  const pathArr = path.split("\\");
  return `.../${pathArr[pathArr.length - 3]}/${pathArr[pathArr.length - 2]}/${
    pathArr[pathArr.length - 1]
  }`;
}

function copyFilesFromFolder(fromPath, toPath) {
  fs.mkdir(toPath, { recursive: true }, (err) => {
    if (err) {
      return console.error(`🟥 Error: can't create folder. ${err.message}`);
    }

    fs.readdir(fromPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        return console.error(`🟥 Error: can't read folder. ${err.message}`);
      }

      files.forEach((file) => {
        if (file.isFile()) {
          const fileToCopy = path.join(fromPath, file.name);
          const newFile = path.join(toPath, file.name);

          fs.copyFile(fileToCopy, newFile, (err) => {
            if (err) {
              return console.error(
                `🟥 Error: can't copy file ${fileToCopy}. ${err.message}`
              );
            }

            console.log(
              `🟩 ${createShortPathString(
                fileToCopy
              )} is copied to ${createShortPathString(newFile)}`
            );
          });
        }
      });

      fs.readdir(toPath, { withFileTypes: true }, (err, filesCopy) => {
        if (err) {
          return console.error(`🟥 Error: can't read folder. ${err.message}`);
        }

        filesCopy.forEach((fileCopy) => {
          if (fileCopy.isFile()) {
            const fileCopyPath = path.join(toPath, fileCopy.name);
            const fileInFolderToCopyPath = path.join(fromPath, fileCopy.name);

            fs.stat(fileInFolderToCopyPath, (err, stats) => {
              if (err) {
                // if file is not present in fromPath, delete it from toPath
                if (err.code === "ENOENT") {
                  fs.unlink(fileCopyPath, (err) => {
                    if (err) {
                      return console.error(
                        `🟥 Error: can't delete file ${fileCopyPath}. ${err.message}`
                      );
                    }

                    console.log(
                      `🟩 Delete: ${createShortPathString(fileCopyPath)}`
                    );
                  });
                } else {
                  console.error(
                    `🟥 Error: can't check file ${fileInFolderToCopyPath}. ${err.message}`
                  );
                }
              }
            });
          }
        });
      });
    });
  });
}

function copyAssetsFolder() {
  copyFilesFromFolder(assetsFontsPath, newAssetsFontsPath);
  copyFilesFromFolder(assetsImgPath, newAssetsImgPath);
  copyFilesFromFolder(assetsSvgPath, newAssetsSvgPath);
}

function mergeStyles() {
  fs.readdir(stylesPath, (err, files) => {
    if (err) {
      return console.error(`🟥 Error: can't read folder | ${err.message}`);
    }

    const cssFiles = files.filter((file) => path.extname(file) === ".css");

    let cssBundleData = "";
    let filesRead = 0;

    cssFiles.forEach((file) => {
      fs.readFile(path.join(stylesPath, file), "utf-8", (err, data) => {
        if (err) {
          console.error(`🟥 Error: can't read ${file} | ${err.message}`);
          return;
        }

        cssBundleData += data + "\n";
        filesRead++;

        if (filesRead === cssFiles.length) {
          fs.writeFile(bundleFilePath, cssBundleData, (err) => {
            if (err) {
              return console.error(
                `🟥 Error: can't write file | ${err.message}`
              );
            }
            console.log(
              `🟩 Merge styles to: ${createShortPathString(bundleFilePath)}`
            );
          });
        }
      });
    });
  });
}

function replaceTemplateTags(s, cb) {
  const regex = /{{(.*?)}}/;

  // find match
  let tag = s.match(regex) ? s.match(regex)[1] : null;
  let componentTag = s.match(regex) ? s.match(regex)[0] : null;
  let componentFileName = tag + ".html";
  const componentPath = path.join(componentsPath, componentFileName);

  // read componentName.html
  fs.readFile(componentPath, "utf-8", (err, componentHtmlString) => {
    if (err) {
      cb(err);
      return;
    }

    // replace string's {{ tag }} with contents of tag.html component
    s = s.replace(componentTag, componentHtmlString);
    console.log(`🟩 Replace: ${componentTag} with ${componentFileName} data`);

    // find next match
    tag = s.match(regex) ? s.match(regex)[1] : null;
    componentTag = s.match(regex) ? s.match(regex)[0] : null;
    componentFileName = tag + ".html";

    if (tag === null) {
      cb(null, s);
      return;
    } else {
      replaceTemplateTags(s, cb);
    }
  });
}

// create dist folder
fs.mkdir(distDirPath, { recursive: true }, (err) => {
  if (err) console.log(err);

  mergeStyles();
  copyAssetsFolder();

  // read template.html
  fs.readFile(templateHtmlPath, "utf-8", (err, htmlTemplateString) => {
    if (err) console.log(err);

    replaceTemplateTags(htmlTemplateString, (err, handledHtmlString) => {
      if (err) console.log(err);

      fs.writeFile(distDirIndexHtmlPath, handledHtmlString, (err) => {
        if (err) console.log(err);
        console.log(
          `🟩 Write file: ${createShortPathString(distDirIndexHtmlPath)}`
        );
        console.log(`\n✨ Build complete!\n`);
      });
    });
  });
});
