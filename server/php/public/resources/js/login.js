// function handleLogin() {
//   let credentials = {
//     'username': document.getElementById('username').value,
//     'password': document.getElementById('password').value
//   };

//   console.log("Sending credentials:", credentials);

//   fetch('http://localhost:8888/', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(credentials)
//   })
//     .then(response => response.text())
//     .then(text => {
//       console.log("(login) Raw response:", text);
//       const data = JSON.parse(text);

//       if (data.errors) {
//         console.log("Error message:", data.errors);
//       }

//       if (data.user.userType === 1) { // Student
//         console.log("Student");

//         if (data.surveys) {
//           // Ensure surveys is always an array, even if it's a single object
//           // Store surveys data in sessionStorage
//           console.log("Storing surveys data in sessionStorage:", data.surveys.data);
//           sessionStorage.setItem('surveysData', JSON.stringify(data.surveys.data));
//         }
        
//         // Redirect to /student/surveys page
//         window.location.href = 'http://localhost:8888/student/surveys';
//       } else if (data.userType === 0) { // Admin
//         console.log("Admin");
//         window.location.href = 'http://localhost:8000/api/items'; // Initiate a request to nodejs server
//       }
//     })
//     .catch(error => console.error("Error:", error));
// }

// TODO: create a env file to store ip or localhost

require('dotnev').config();

function login() {
  const STUDENT_URL = process.env.STUDENT_SERVER_URL;
  const ADMIN_URL = process.env.ADMIN_SERVER_URL;

  let credentials = {
    'username': document.getElementById('username').value,
    'password': document.getElementById('password').value
  };

  console.log("Sending credentials:", credentials);

  fetch(`${STUDENT_URL}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
    .then(response => response.json())
    .then(data => {
      console.log("(login) Raw response:", data);

      if (data.errors) {
        console.log("Error message:", data.errors);
      }

      if (data.userType === 0) { // Admin
        console.log("Admin");
        window.location.href = `${ADMIN_URL}/api/items`; 
        return;
      }
      console.log("Student");
    }).catch(error => console.log("Error:", error))

  fetch(`${STUDENT_URL}/student`)
  .then(response => response.text())
  .then(surveys => {
    console.log("Storing surveys data in sessionStorage:", surveys);
    sessionStorage.setItem('surveysData', JSON.stringify(surveys));
    window.location.href = `${STUDENT_URL}/student/surveys`;
  }).catch(error => console.log("Error:", error));
}