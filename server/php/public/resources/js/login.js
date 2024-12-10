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

            // Store user data and token
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('fname', data.fname);

            if (data.token) {
                sessionStorage.setItem('token', data.token);
                setCookie('token', data.token, 1);  // Store the token in a cookie for 1 day
            } else {
                sessionStorage.removeItem('token');
            }

            if (data.errors) {
                console.log("Error message:", data.errors);
                return;
            }

            if (data.userType === 0) { // Admin
                console.log("Admin");
                console.log("Admin URL:", ADMIN_URL); // Log the exact URL

                // Use a more robust fetch with error handling
                fetchWithToken(ADMIN_URL)
                    .then(response => {
                        console.log("Response status:", response.status);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.text(); // or .json() depending on what you expect
                    })
                    .then(responseData => {
                        console.log("Admin fetch successful:", responseData);
                        window.location.href = `${ADMIN_URL}/`;
                    })
                    .catch(error => {
                        console.error("Detailed Admin URL fetch error:", error);
                        console.error("Error name:", error.name);
                        console.error("Error message:", error.message);

                        // Redirect even if there was an error
                        window.location.href = `${ADMIN_URL}/`;
                    });
                return;
            }

            if (data.userType === 1) { // Student
                console.log("Student");
                window.location.href = `${STUDENT_URL}/student/surveys`;
                return;
            }
        }).catch(error => {
        console.error("POST Student Error:", error);
    });
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function fetchWithToken(url, options = {}) {
    const token = sessionStorage.getItem('token');
    console.log("Fetching with token:", token);
    console.log("Full URL:", url);

    return fetch(url, {
        method: 'GET',
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,  // Explicitly add 'Bearer '
            'Content-Type': 'application/json'
        }
    });
}


// console.log("GET Fetching surveys data");
  // fetch(`${STUDENT_URL}/student`)
  // .then(response => response.text())
  // .then(surveys => {
  //   console.log("Storing surveys data in sessionStorage:", surveys);
  //   sessionStorage.setItem('surveysData', JSON.stringify(surveys));
  //   window.location.href = `${STUDENT_URL}/student/surveys`;
  // }).catch(error => console.log("Error:", error));

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      login();
    });
  }
});