const express = require('express');
const { SurveyDAL } = require('../../dal-service/controller/survey-dal');
const { UserDAL } = require('../../dal-service/controller/user-dal');
const {ProgramDAL} = require('../../dal-service/controller/program-dal');
const surveyRoutes = express.Router();

//
surveyRoutes.get('/fetch-data', async (req, res) => {
    try {
        const programs = await ProgramDAL.getAllPrograms();
        const availability = programs.map(program => program.program_id);
        const users = await UserDAL.getAllUsers();
        const responders = users.map(user => `${user.given_name} ${user.last_name}`);

        res.status(200).json({ availability, responders });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Route to publish survey data
surveyRoutes.post('/publish-survey', async (req, res) => {
    const surveyData = req.body;

    try {
        const surveyID = await SurveyDAL.insertSurvey(surveyData.survey);
        await SurveyDAL.insertQuestions(surveyData.questions);

        res.status(200).json({ message: 'Survey published successfully', surveyID });
    } catch (error) {
        console.error('Error publishing survey:', error);
        res.status(500).json({ error: 'Failed to publish survey' });
    }
});

module.exports = surveyRoutes;