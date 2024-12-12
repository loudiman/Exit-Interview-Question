async function callAPI() {
    console.log("Function has been called");
    const userType = 0
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const last_name = document.getElementById("last_name").value
    const given_name = document.getElementById("given_name").value


    console.log(username, password, last_name, given_name);

    if (!validateUsername(username)) {
        return;
    }

    try {
        console.log("Triggering fetch")
        const response = await fetch(`http://localhost:2020/api/user-service/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: userType,
                username: username,
                password: password,
                last_name: last_name,
                given_name: given_name
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || "Account was not created"}`);
            return;
        }

        alert("Admin Account created successfully");
    } catch (error) {
        console.error("Error during API call:", error);
        alert("An unexpected error occurred.");
    }
}

// Validate username format
function validateUsername(username) {
    const regex = /^\d{7}$/;
    return regex.test(username);
}

const createButton = document.getElementById("create-button");
console.log(createButton)
createButton.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Event Triggered")
    callAPI();
});
