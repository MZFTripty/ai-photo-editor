const fs = require("fs");
const path = require("path");

function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Remove single-line console.log statements
    content = content.replace(/^\s*console\.log\([^)]*\);?\s*$/gm, "");

    // Remove multi-line console.log statements
    content = content.replace(/^\s*console\.log\(\s*[\s\S]*?\);\s*$/gm, "");

    // Remove commented console.log
    content = content.replace(/^\s*\/\/\s*console\.log\([^)]*\);?\s*$/gm, "");

    // Clean up multiple consecutive empty lines (max 2 empty lines)
    content = content.replace(/\n\n\n+/g, "\n\n");

    fs.writeFileSync(filePath, content, "utf8");
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir, extensions = [".ts", ".tsx", ".js", ".jsx"]) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        walkDirectory(filePath, extensions);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        removeConsoleLogs(filePath);
      }
    }
  });
}
// Start from current directory
walkDirectory(process.cwd());
