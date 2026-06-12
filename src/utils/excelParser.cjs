const XLSX = require('xlsx');

/**
 * Parses Excel buffer and extracts Names and URLs.
 * Detects headers if present, or falls back to positional columns.
 * Can handle up to 1000 rows.
 *
 * @param {Buffer} buffer - The Excel file content buffer.
 * @returns {Array<{name: string, url: string}>} Array of site names and URLs.
 */
function parseExcelBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('No sheets found in Excel file');
  }

  const worksheet = workbook.Sheets[sheetName];
  // Convert worksheet to JSON rows (array of arrays to represent table rows)
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  if (rawData.length === 0) {
    throw new Error('Excel sheet is empty');
  }

  // Let's identify the header row or search for columns
  // We search for a row that might contain "name" and "url" or "link"
  let headerRowIndex = -1;
  let nameColIndex = 0;
  let urlColIndex = 1;
  let hasHeader = false;

  // Search the first 5 rows for column headers
  for (let r = 0; r < Math.min(5, rawData.length); r++) {
    const row = rawData[r];
    if (!row) continue;
    let foundName = -1;
    let foundUrl = -1;

    for (let c = 0; c < row.length; c++) {
      const val = String(row[c]).trim().toLowerCase();
      if (val === 'name' || val === 'site' || val === 'site name' || val === 'website' || val === 'title') {
        foundName = c;
      } else if (val === 'url' || val === 'link' || val === 'website url' || val === 'website link') {
        foundUrl = c;
      }
    }

    if (foundName !== -1 && foundUrl !== -1) {
      headerRowIndex = r;
      nameColIndex = foundName;
      urlColIndex = foundUrl;
      hasHeader = true;
      break;
    }
  }

  // Determine starting row for data extraction
  const startRow = hasHeader ? headerRowIndex + 1 : 0;
  const items = [];

  for (let r = startRow; r < rawData.length; r++) {
    const row = rawData[r];
    if (!row || row.length === 0) continue;

    // Check if row is entirely empty
    if (row.every(cell => String(cell).trim() === '')) {
      continue;
    }

    let name = '';
    let url = '';

    if (hasHeader) {
      name = row[nameColIndex] !== undefined ? String(row[nameColIndex]).trim() : '';
      url = row[urlColIndex] !== undefined ? String(row[urlColIndex]).trim() : '';
    } else {
      // Positional fallback:
      // Try to find if any cell in the row starts with http:// or https:// to be the URL.
      // If we find it, we treat it as URL, and the first column (or column 0) as Name.
      const foundUrlIndex = row.findIndex(cell => {
        const str = String(cell).trim();
        return str.startsWith('http://') || str.startsWith('https://');
      });

      if (foundUrlIndex !== -1) {
        urlColIndex = foundUrlIndex;
        url = String(row[urlColIndex]).trim();
        // The name is usually the other column (index 0, or 1 if URL is at 0)
        nameColIndex = foundUrlIndex === 0 ? 1 : 0;
        name = row[nameColIndex] !== undefined ? String(row[nameColIndex]).trim() : '';
      } else {
        // Fallback to Column 0 = Name, Column 1 = URL
        name = row[0] !== undefined ? String(row[0]).trim() : '';
        url = row[1] !== undefined ? String(row[1]).trim() : '';
      }
    }

    // Clean up tabs, spaces, and newline characters from the URL
    url = url.replace(/[\s\t\r\n]+/g, '');

    // Skip row if both are empty
    if (!name && !url) continue;

    items.push({
      name: name || 'Unnamed Site',
      url: url
    });

    // Enforce row safety limits (process up to 1000 rows)
    if (items.length >= 1000) {
      break;
    }
  }

  return items;
}

module.exports = { parseExcelBuffer };
