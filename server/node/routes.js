const express = require('express');
const router = express.Router();
const path = require('path');

// Serve static files from public directory
router.use(express.static(path.join(__dirname, 'public')));

router.get('/admin/dashboard', (req, res) => {
    // res.json({ message: 'Test route working' });
    res.sendFile(path.join(__dirname, 'public', 'resources', 'views', 'admin-dashboard.html'));
});

router.get('/admin/surveys', (req, res) => {
    // res.json({ message: 'Test route working' });
    res.sendFile(path.join(__dirname, 'public', 'resources', 'views', 'admin-survey-templates.html'));
});

router.get('/admin/surveys/edit', (req, res) => {
    // res.json({ message: 'Test route working' });
    res.sendFile(path.join(__dirname, 'public', 'resources', 'views', 'admin-survey-creation.html'));
});

router.get('/admin/surveys/publish', (req, res) => {
    // res.json({ message: 'Test route working' });
    res.sendFile(path.join(__dirname, 'public', 'resources', 'views', 'admin-survey-publish.html'));
});

router.get('/admin/profile', (req, res) => {
    // res.json({ message: 'Test route working' });
    res.sendFile(path.join(__dirname, 'public', 'resources', 'views', 'admin-profile.html'));
});

router.get('/admin/register', (req, res) => {
    // res.json({ message: 'Test route working' });
    res.sendFile(path.join(__dirname, 'public', 'resources', 'views', 'index.html'));
});

// router.post('/', (req, res) => {
//     // Create new survey
//     res.json({ message: 'Survey created' });
// });

// router.get('/:id', (req, res) => {
//     // Get specific survey
//     res.json({ survey: { id: req.params.id } });
// });

module.exports = router;