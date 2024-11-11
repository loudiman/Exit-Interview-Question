// async function handleLogin() {

// Load environment variables
// require('dotenv').config();

// const studentServerUrl = process.env.STUDENT_SERVER_URL;
// const adminServerUrl = process.env.ADMIN_SERVER_URL;

// import { createSurveyElements } from './student-homepage'

function handleLogin() {
  let credentials = {
    'username': document.getElementById('username').value,
    'password': document.getElementById('password').value
  };

  console.log("Sending credentials:", credentials);

  fetch('http://localhost:8888/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
    .then(response => response.text())
    .then(text => {
      console.log("(login) Raw response:", text);
      const data = JSON.parse(text);

      if (data.errors) {
        console.log("Error message:", data.errors);
      }

      if (data.userType === 1) { // Student
        console.log("Student");

        if (data.surveys) {
          // Ensure surveys is always an array, even if it's a single object
          const surveysData = Array.isArray(data.surveys) ? data.surveys : [data.surveys];
          
          // Store surveys data in sessionStorage
          console.log("Storing surveys data in sessionStorage:", surveysData);
          sessionStorage.setItem('surveysData', JSON.stringify(surveysData));
        }
        
        // Redirect to /student/surveys page
        window.location.href = 'http://localhost:8888/student/surveys';
      } else if (data.userType === 0) { // Admin
        console.log("Admin");
        window.location.href = 'http://localhost:8000/api/items'; // Initiate a request to nodejs server
      }
    })
    .catch(error => console.error("Error:", error));
}



  