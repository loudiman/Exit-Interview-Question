const express = require('express');
const SurveyCreationLogic = require('../logic/survey-creation-logic');

const router = express.Router();

router.post('/save', async (req, res) => {
    try {
        const surveyData = req.body;
        const result = await SurveyCreationLogic.saveSurvey(surveyData);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in /save route:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;
