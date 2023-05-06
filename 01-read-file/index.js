const fs = require("fs");
const path = require("node:path");

const textFilePath = path.join(__dirname, "textt.txt");
const stream = fs.createReadStream(textFilePath, "utf-8");

let data = "";

stream.on("data", (chunk) => console.log((data += chunk)));
stream.on("error", (error) => console.log("Error", error.message));
