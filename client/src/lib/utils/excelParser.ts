import * as XLSX from 'xlsx';

export interface ExcelRow {
  name: string;
  url: string;
}

export function parseExcelBuffer(buffer: Buffer): ExcelRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('No sheets found in Excel file');
  }

  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });

  if (rawData.length === 0) {
    throw new Error('Excel sheet is empty');
  }

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

  const startRow = hasHeader ? headerRowIndex + 1 : 0;
  const items: ExcelRow[] = [];

  for (let r = startRow; r < rawData.length; r++) {
    const row = rawData[r];
    if (!row || row.length === 0) continue;

    if (row.every((cell) => String(cell).trim() === '')) {
      continue;
    }

    let name = '';
    let url = '';

    if (hasHeader) {
      name = row[nameColIndex] !== undefined ? String(row[nameColIndex]).trim() : '';
      url = row[urlColIndex] !== undefined ? String(row[urlColIndex]).trim() : '';
    } else {
      const foundUrlIndex = row.findIndex((cell) => {
        const str = String(cell).trim();
        return str.startsWith('http://') || str.startsWith('https://');
      });

      if (foundUrlIndex !== -1) {
        urlColIndex = foundUrlIndex;
        url = String(row[urlColIndex]).trim();
        nameColIndex = foundUrlIndex === 0 ? 1 : 0;
        name = row[nameColIndex] !== undefined ? String(row[nameColIndex]).trim() : '';
      } else {
        name = row[0] !== undefined ? String(row[0]).trim() : '';
        url = row[1] !== undefined ? String(row[1]).trim() : '';
      }
    }

    url = url.replace(/[\s\t\r\n]+/g, '');

    if (!name && !url) continue;

    items.push({
      name: name || 'Unnamed Site',
      url: url,
    });

    if (items.length >= 1000) {
      break;
    }
  }

  return items;
}
