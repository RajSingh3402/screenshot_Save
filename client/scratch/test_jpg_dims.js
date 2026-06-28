const fs = require('fs');
const path = require('path');

function getJpgDimensions(filePath) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buffer = fs.readFileSync(fd);
    let i = 2; // skip SOI (0xFFD8)
    while (i < buffer.length) {
      if (buffer[i] !== 0xFF) {
        break;
      }
      const marker = buffer[i + 1];
      if (marker === 0xD9 || marker === 0xDA) {
        break;
      }
      const length = buffer.readUInt16BE(i + 2);
      if (marker >= 0xC0 && marker <= 0xC3) {
        const height = buffer.readUInt16BE(i + 5);
        const width = buffer.readUInt16BE(i + 7);
        return { width, height };
      }
      i += 2 + length;
    }
    throw new Error('SOF marker not found');
  } finally {
    fs.closeSync(fd);
  }
}

const screenshotsDir = 'c:/screenshot_project/client/public/screenshots';
const files = fs.readdirSync(screenshotsDir);
for (const file of files) {
  if (file.endsWith('.jpg')) {
    try {
      const filePath = path.join(screenshotsDir, file);
      const dims = getJpgDimensions(filePath);
      console.log(file + ': ' + dims.width + 'x' + dims.height);
    } catch (e) {
      console.error('Error for ' + file + ':', e.message);
    }
  }
}
