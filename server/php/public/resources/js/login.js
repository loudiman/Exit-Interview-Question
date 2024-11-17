import { config } from './config.js';

export function login() {
  const STUDENT_URL = config.STUDENT_SERVER_URL;
  const ADMIN_URL = config.ADMIN_SERVER_URL;

  let credentials = {
    'username': document.getElementById('username').value,
    'password': document.getElementById('password').value
  };

  console.log("POST Sending credentials:", credentials);

  fetch(`${STUDENT_URL}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
    .then(response => response.text())
    .then(data => {
      console.log("(login) Raw response:", data);
      data = JSON.parse(data);

      if (data.errors) {
        console.log("Error message:", data.errors);
      }

      if (data.userType === 0) { // Admin
        console.log("Admin");
        window.location.href = `${ADMIN_URL}/api/items`; 
        return;
      }

      if (data.userType === 1)  // Student
        console.log("Student");
    }).catch(error => {
      console.log("POST Student Error:", error);
    })
  
  console.log("GET Fetching surveys data");

  fetch(`${STUDENT_URL}/student`)
  .then(response => response.text())
  .then(surveys => {
    console.log("Storing surveys data in sessionStorage:", surveys);
    sessionStorage.setItem('surveysData', JSON.stringify(surveys));
    window.location.href = `${STUDENT_URL}/student/surveys`;
  }).catch(error => console.log("Error:", error));
}

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      login();
    });
  }
});