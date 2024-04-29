const fs = require('fs');
const path = require('path');

let filePaths = [];

function processFolder(folderPath, parentPath = '') {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading the directory", err);
      return;
    }

    let processedCount = 0;
    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats", err);
          return;
        }

        if (stats.isDirectory()) {
          const folderName = path.join(parentPath, file);
          processFolder(filePath, folderName);
        } else {
          const fileName = path.join(parentPath, file);
          filePaths.push({ name: fileName, size: stats.size });
        }
        processedCount++;
        if (processedCount === files.length) {
          checkAndOutput();
        }
      });
    });
  });
}

function checkAndOutput() {
  filePaths.sort((a, b) => b.size - a.size);
  filePaths.forEach(file => {
    let sizeStr = formatSize(file.size);
    console.log(`${file.name}: ${sizeStr}`);
  });
}

function formatSize(size) {
  if (size > 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + " kB";
  } else {
    return size + " B";
  }
}

module.exports = { listFileSizes: processFolder };
