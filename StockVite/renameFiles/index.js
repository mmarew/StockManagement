const fs = require("fs");
const path = require("path");

const srcDirectory = "../../stock-vite/src";

// Function to recursively traverse directories and find files
function traverseDirectory(directoryPath) {
  // Read files and folders in the current directory
  fs.readdir(directoryPath, (err, items) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Iterate through items in the directory
    items.forEach((item) => {
      // Construct full path of the item
      const itemPath = path.join(directoryPath, item);

      // Check if the item is a file or directory
      fs.stat(itemPath, (err, stats) => {
        if (err) {
          console.error("Error reading file stats:", err);
          return;
        }

        if (stats.isDirectory()) {
          // Recursively traverse subdirectories
          traverseDirectory(itemPath);
        } else if (stats.isFile()) {
          // Check if the file has a .js extension
          if (path.extname(item) === ".js") {
            // Construct old and new file paths
            const oldFilePath = itemPath;
            const newFilePath = path.join(
              directoryPath,
              path.basename(item, ".js") + ".jsx"
            );

            // Rename the file
            fs.rename(oldFilePath, newFilePath, (err) => {
              if (err) {
                console.error(`Error renaming file ${item}:`, err);
              } else {
                console.log(
                  `File ${item} renamed to ${path.basename(item, ".js")}.jsx`
                );
              }
            });
          }
        }
      });
    });
  });
}

// Start traversal from the source directory
traverseDirectory(srcDirectory);
