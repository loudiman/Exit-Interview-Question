// require('dotenv-flow').config();

const express = require('express');
const app = express();

// Import middleware for security and logging
const cors = require('cors'); // Allows cross-origin requests
const helmet = require('helmet'); // Adds security headers
// const logger = require('./utils/logger'); // Custom logging utility

const routes = require('./routes.js');

// Configure Express to parse JSON and URL-encoded data
app.use(express.json()); // Automatically parses JSON data
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Enable (CORS) for handling requests from different domains
app.use(cors());

// Use Helmet to set various HTTP headers for security
app.use(helmet());

// Mount API routes
app.use('/', routes);

// Catch-all route handler for any requests to an unknown route
app.use((_req, res) => {
    return res.status(404).json({ error: 'Route not found' });
});

// const port = process.env.PORT || 5000;
const port = 5000;

app.listen(port, () => {
    // Log a message to indicate the server is running
    // logger.info(`App Listening on port ${port}`);
    console.log(`App Listening on port ${port}`);
});