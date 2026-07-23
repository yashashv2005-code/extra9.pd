const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const waitlistRoutes = require('./routes/waitlistRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(morgan('combined'));

// Serve the zero-build operations console from the same origin as the API.
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', data: {} });
});

app.use('/api/waitlist', waitlistRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
