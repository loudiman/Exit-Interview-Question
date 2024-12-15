const express = require('express');
const path = require('path');
const router = express.Router();

// Base directory adjusted to locate "../../../resources/views"
const baseDir = path.join(__dirname, '../../../../resources/views');

/**
 * Main Pages:
 */

router.get('/admin/surveys', (req, res) => {
    res.sendFile(path.join(baseDir, 'survey-view.html'));
})

router.get('/admin/create', (req, res) => {
    res.sendFile(path.join(baseDir, 'survey-templates.html'));
})

router.get('/admin/respondents', (req, res) => {
    res.sendFile(path.join(baseDir, 'respondents.html'));
})

router.get('/admin/profile', (req, res) => {
    res.sendFile(path.join(baseDir, 'admin-profile.html'));
});

/*
  Creation Subpages:
 */
router.get('/admin/survey/creation', (req, res) => {
    res.sendFile(path.join(baseDir, 'survey-creation.html'));
})

router.get('/admin/survey/publish', (req, res) => {
    res.sendFile(path.join(baseDir, 'admin-publish-survey.html'));
})

/*
  Profile Subpages:
 */
router.get('/admin/profile/create', (req, res) => {
    res.sendFile(path.join(baseDir, 'admin-profile-createacc.html'));
});

router.get('/admin/profile/edit', (req, res) => {
    res.sendFile(path.join(baseDir, 'admin-profile-changepass.html'));
});

/*
  View Subpages:
 */
router.get('/admin/surveys/edit', (req, res) => {
    res.sendFile(path.join(baseDir, 'survey-edit.html'));
});

router.get('/admin/surveys/publish', (req, res) => {
    res.sendFile(path.join(baseDir, 'admin-publish-edit.html'));
});

/*
  Dashboard Subpages
 */
router.get('/admin/dashboard/survey', (req, res) => {
    res.sendFile(path.join(baseDir, 'admin-view-questions.html'));
})

module.exports = router;
