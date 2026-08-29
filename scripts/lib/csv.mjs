export const parseCsv = (text) => {
  const rows = [];
  let row = [], field = '', quoted = false;
  const source = text.replace(/^\uFEFF/, '');
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += char;
  }
  if (field || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  return rows.filter((item) => item.some((value) => value !== ''));
};

const quote = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export const serializeCsv = (rows) => `${rows.map((row) => row.map(quote).join(',')).join('\n')}\n`;

export const rowsToObjects = (rows) => {
  if (!rows.length) return [];
  const [header, ...body] = rows;
  return body.map((row) => Object.fromEntries(header.map((name, index) => [name, row[index] ?? ''])));
};

export const objectsToRows = (header, objects) => [header, ...objects.map((object) => header.map((name) => object[name] ?? ''))];
