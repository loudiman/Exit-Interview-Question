const axios = require (`axios`);

const apiClient = axios.create({
    baseURL: 'http://localhost:2019/api/dal',
    timeout: 5000,
})

class SurveyCreationLogic {
    static async saveSurvey(surveyData) {
        try {
            const { survey } = surveyData;
            if (!survey || !survey['survey-title'] || !survey.questions) {
                throw new Error('Invalid survey data.');
            }
            //Save survey
            const surveyResponse = await apiClient.post(`/survey`, {
                surveyTitle: survey['survey-title'],
                programId: survey.program_id || null,
                surveyStart: survey['period-start'] || null,
                surveyEnd: survey['period-end'] || null,
                status: survey['status']
            });

            const surveyID = surveyResponse.data.surveyID;

            //Save questions
            const questions = survey.questions.map((q) => ({
                question_json: JSON.stringify(q.question_json),
                question_type: q.question_type
            }));
            const questionsReponse = await apiClient.post(`/questions`, {questions});
            const questionIDs = questionsReponse.data.questionIDs;

            // Link questions to survey
            await apiClient.post('/questionnaire', { questionIDs, surveyID });

            // Save responders
            if (survey.responders && survey.responders.length > 0) {
                await apiClient.post('/responders', { responders: survey.responders, surveyID });
            }

            return { success: true, message: 'Survey saved successfully.', surveyID };

        } catch (error) {
            console.error('Error saving survey:', error.message);
            return { success: false, message: `Failed to save survey: ${error.message}` };
        }
    }
}

module.exports = SurveyCreationLogic;
