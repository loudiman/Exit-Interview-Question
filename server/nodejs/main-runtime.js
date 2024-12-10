const express = require('express');
const path = require('path');
const adminProfileRoutes = require('./services/resource-service/admin-profile-submission/router-admin-profile'); // Import admin profile routes

const app = express(); // Initialize Express app

// Define static directories for serving CSS and JS
const publicDir = path.join(__dirname, 'resources');
app.use('/static/css', express.static(path.join(publicDir, 'css')));
app.use('/static/js', express.static(path.join(publicDir, 'js')));
app.use('/static/images', express.static(path.join(publicDir, 'images')));

// Use admin profile routes
app.use(adminProfileRoutes); // Now app is defined and routes will be properly registered

// Default route to serve admin profile HTML
app.get('/', (req, res) => {
    const html = path.join(__dirname, 'resources', 'views', 'admin-profile.html'); // Ensure this path and file exist
    res.sendFile(html);
});

// Export the app for usage in the main server file
module.exports = app;
