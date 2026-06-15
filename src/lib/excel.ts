import * as XLSX from 'xlsx';
import type { ParsedRow } from './types';

const NAME_HEADERS = new Set(['name', 'site', 'site name', 'website', 'title']);
const URL_HEADERS = new Set(['url', 'link', 'website url', 'website link']);

/**
 * Parse an Excel buffer into `{ name, url }` rows.
 * Detects a header row (first 5 rows) or falls back to positional columns.
 * Caps output at 1000 rows.
 */
export function parseExcelBuffer(buffer: Buffer): ParsedRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('No sheets found in Excel file');

  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: '' });
  if (rawData.length === 0) throw new Error('Excel sheet is empty');

  // Locate a header row containing both a name-like and url-like column.
  let headerRowIndex = -1;
  let nameColIndex = 0;
  let urlColIndex = 1;
  let hasHeader = false;

  for (let r = 0; r < Math.min(5, rawData.length); r++) {
    const row = rawData[r];
    if (!row) continue;
    let foundName = -1;
    let foundUrl = -1;

    for (let c = 0; c < row.length; c++) {
      const val = String(row[c]).trim().toLowerCase();
      if (NAME_HEADERS.has(val)) foundName = c;
      else if (URL_HEADERS.has(val)) foundUrl = c;
    }

    if (foundName !== -1 && foundUrl !== -1) {
      headerRowIndex = r;
      nameColIndex = foundName;
      urlColIndex = foundUrl;
      hasHeader = true;
      break;
    }
  }

  const startRow = hasHeader ? headerRowIndex + 1 : 0;
  const items: ParsedRow[] = [];

  for (let r = startRow; r < rawData.length; r++) {
    const row = rawData[r];
    if (!row || row.length === 0) continue;
    if (row.every((cell) => String(cell).trim() === '')) continue;

    let name = '';
    let url = '';

    if (hasHeader) {
      name = row[nameColIndex] !== undefined ? String(row[nameColIndex]).trim() : '';
      url = row[urlColIndex] !== undefined ? String(row[urlColIndex]).trim() : '';
    } else {
      // Positional fallback: find a cell that looks like a URL, treat the other as name.
      const foundUrlIndex = row.findIndex((cell) => {
        const str = String(cell).trim();
        return str.startsWith('http://') || str.startsWith('https://');
      });

      if (foundUrlIndex !== -1) {
        url = String(row[foundUrlIndex]).trim();
        const nameIdx = foundUrlIndex === 0 ? 1 : 0;
        name = row[nameIdx] !== undefined ? String(row[nameIdx]).trim() : '';
      } else {
        name = row[0] !== undefined ? String(row[0]).trim() : '';
        url = row[1] !== undefined ? String(row[1]).trim() : '';
      }
    }

    // Strip stray whitespace/tabs/newlines from the URL.
    url = url.replace(/[\s\t\r\n]+/g, '');
    if (!name && !url) continue;

    items.push({ name: name || 'Unnamed Site', url });
    if (items.length >= 1000) break;
  }

  return items;
}
