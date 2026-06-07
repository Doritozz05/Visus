const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const destDir = path.join(__dirname, '..', 'public');
const destFile = path.join(destDir, 'pdf.worker.min.mjs');

console.log('Copying PDF worker locally...');

try {
  // Ensure node_modules exists
  if (!fs.existsSync(srcFile)) {
    console.error(`Error: Source file not found at ${srcFile}`);
    console.error('Make sure dependencies are installed (run npm install).');
    process.exit(1);
  }

  // Ensure public folder exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy worker file
  fs.copyFileSync(srcFile, destFile);
  console.log(`Successfully copied PDF worker to: ${destFile}`);
} catch (err) {
  console.error('Failed to copy PDF worker:', err);
  process.exit(1);
}
