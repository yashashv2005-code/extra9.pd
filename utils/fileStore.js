const fs = require('fs').promises;
const os = require('os');
const path = require('path');

const netlifyRuntime = process.env.NETLIFY === 'true' || process.env.NETLIFY === '1';
const defaultDataFile = netlifyRuntime
  ? path.join(os.tmpdir(), 'game-waitlist.json')
  : path.join(__dirname, '..', 'data', 'waitlist.json');
const dataFile = path.resolve(process.env.DATA_FILE || defaultDataFile);
let operation = Promise.resolve();

const ensureFile = async () => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, '[]', 'utf8');
  }
};

const readAll = async () => {
  await ensureFile();
  const contents = await fs.readFile(dataFile, 'utf8');
  // Strip a UTF-8 BOM so files created by some Windows editors remain readable.
  const records = JSON.parse(contents.replace(/^\uFEFF/, ''));
  return Array.isArray(records) ? records : [];
};

const writeAll = async (records) => {
  operation = operation.then(async () => {
    await ensureFile();
    await fs.writeFile(dataFile, JSON.stringify(records, null, 2), 'utf8');
  });
  return operation;
};

module.exports = { readAll, writeAll };
