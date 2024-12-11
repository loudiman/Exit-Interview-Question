const express = require('express');
const path = require('path');
const router = express.Router();

// Base directory adjusted to locate "../../../resources/views"
const baseDir = path.join(__dirname, '../../../resources/views');

// Route for admin-profile-createacc
router.get('/admin-profile-createacc', (req, res) => {
    res.sendFile(path.join(baseDir, 'admin-profile-createacc.html'));
});

// Route for admin-profile
router.get('/admin-profile', (req, res) => {
    res.sendFile(path.join(baseDir, 'admin-profile.html'));
});

// Route for admin-profile-changepass
router.get('/admin-profile-changepass', (req, res) => {
    res.sendFile(path.join(baseDir, 'admin-profile-changepass.html'));
});

module.exports = router;