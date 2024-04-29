#!/usr/bin/env node
const { listFileSizes } = require('./filesizeLister');

const folderPath = process.argv[2];
if (!folderPath) {
  console.log("Please specify a folder path.");
  process.exit(1);
}

listFileSizes(folderPath);
