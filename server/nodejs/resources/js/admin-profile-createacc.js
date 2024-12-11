// Sidebar toggle function
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.display === "block") {
        sidebar.style.display = "none";
    } else {
        sidebar.style.display = "block";
    }
}

// Handle form submission for creating an admin account
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const admin= document.getElementById("userType").value.trim();
        const thisUsername = document.getElementById("email").value.trim();
        const thisPassword = document.getElementById("password").value.trim();
        const thisLast_name= document.getElementById("last_name").value.trim();
        const thisGiven_name=document.getElementById("given_name").value.trim();
        // Validate inputs
        if (!thisUsername || !thisPassword || !thisLast_name || !thisGiven_name) {
            alert("Please fill in all fields.");
            return;
        }

        if (!validateUsername(thisUsername)) {
            alert("Please enter a valid username.");
            return;
        }

        // Prepare payload for submission
        const payload = {
            userType:admin,
            username:thisUsername,
            password:thisPassword,
            last_name:thisLast_name,
            given_name:thisGiven_name,
            type:0
        };

        console.log("Submitting admin account creation request:", payload);

        // Simulate API call
        fetch('http://localhost:2019/api/user-service/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create account. Please try again.");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Account creation response:", data);
                alert("Admin account created successfully!");
                form.reset(); // Reset the form
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
            });
    });
});

// Validate username format
function validateUsername(thisUsername) {
    const regex = /^\d{7}$/;
    return regex.test(thisUsername);
}

// Example usage
console.log(validateUsername("1234567")); // true
console.log(validateUsername("abcdefg")); // false
console.log(validateUsername("123456"));  // false
console.log(validateUsername("12345678")); // false