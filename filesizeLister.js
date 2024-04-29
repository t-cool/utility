const fs = require('fs');
const path = require('path');

// フォルダ内のすべてのファイルとサブフォルダを再帰的に処理する関数
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
          // サブフォルダの場合、再帰的に処理
          const folderName = path.join(parentPath, file);
          processFolder(filePath, folderName);
        } else {
          // ファイルの場合、ファイルパスとサイズを保存
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

// 引数でフォルダパスを指定
const folderPath = process.argv[2];
const filePaths = [];

// フォルダ内のすべてのファイルとサブフォルダを再帰的に処理
processFolder(folderPath);

// ファイルのサイズで降順にソートして出力する関数
function checkAndOutput() {
  // 全てのファイルが処理された後にサイズで降順にソートして出力
  filePaths.sort((a, b) => b.size - a.size);
  filePaths.forEach(file => {
    let sizeStr;
    if (file.size > 1024 * 1024) {
      sizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    } else if (file.size > 1024) {
      sizeStr = (file.size / 1024).toFixed(2) + " kB";
    } else {
      sizeStr = file.size + " B";
    }
    console.log(`${file.name}: ${sizeStr}`);
  });
}
