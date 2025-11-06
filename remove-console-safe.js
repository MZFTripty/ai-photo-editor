const fs = require("fs");
const path = require("path");

function removeConsoleLogs(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const newLines = [];
    let inMultiLineConsole = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Check if this line starts a console.log
      if (trimmed.startsWith("console.log(") && !inMultiLineConsole) {
        // Check if it's a complete single-line console.log
        if (trimmed.endsWith(");") || trimmed.endsWith(")")) {
          // Skip this line (don't add to newLines)
          continue;
        } else {
          // Multi-line console.log starts
          inMultiLineConsole = true;
          continue;
        }
      }

      // If we're inside a multi-line console.log
      if (inMultiLineConsole) {
        // Check if this line ends the console.log
        if (trimmed.endsWith(");") || trimmed.endsWith(")")) {
          inMultiLineConsole = false;
          continue; // Skip this line too
        }
        // Otherwise, skip this line (it's part of the console.log)
        continue;
      }

      // Skip commented out console.log
      if (trimmed.startsWith("// console.log(")) {
        continue;
      }

      // Keep all other lines
      newLines.push(line);
    }

    let newContent = newLines.join("\n");

    // Clean up excessive empty lines (max 2 consecutive empty lines)
    newContent = newContent.replace(/\n\n\n+/g, "\n\n");

    fs.writeFileSync(filePath, newContent, "utf8");
    return true;
  } catch (error) {
    console.error(`❌ Error: ${filePath}`, error.message);
    return false;
  }
}

function walkDirectory(dir, extensions = [".ts", ".tsx", ".js", ".jsx"]) {
  const files = fs.readdirSync(dir);
  let count = 0;

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        count += walkDirectory(filePath, extensions);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        if (removeConsoleLogs(filePath)) {
          count++;
        }
      }
    }
  });

  return count;
}

const processed = walkDirectory(process.cwd());
