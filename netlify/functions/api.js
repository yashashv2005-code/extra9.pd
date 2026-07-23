const serverless = require('serverless-http');

// Netlify's deployed bundle is read-only. Use its writable temporary directory
// for the demo's file-backed storage before the Express app is initialized.
process.env.NETLIFY = 'true';
process.env.DATA_FILE = '/tmp/game-waitlist.json';

const app = require('../../app');

module.exports.handler = serverless(app);
