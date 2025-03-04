import config from './config.js';
const API = config.API_URL

async function callAPI(){

    //This is for debug purposes please uncomment this later on
    sessionStorage.setItem("username","2233915")

    console.log("function has been called")
    const old_password = document.getElementById("old_password").value
    const new_password = document.getElementById("new_password").value
    console.log(old_password)
    console.log(new_password)

    // Guard clause for new password being the same for the old password
    if(!verifyPassword(old_password, new_password)){
        return
    }

    const localUsername = sessionStorage.getItem("username")
    //This makes a POST request to the api
    const response = await fetch(`${API}/user-service/user/${localUsername}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: localUsername,
            oldPassword: old_password,
            newPassword: new_password
        })

    })

    //If server does not give a 200 response alert user that password wasnt changed
    if(!response.ok){
        alert("Password was not changed")
        return
    }

    //If guard clauses pass this means that password was changes successfully
    alert("Password successfully changed")
    console.log(`Old Pass: ${old_password} and New Pass: ${new_password}`)  //Debug statement
    return
}

//This verifies that the new password isnt the same as the old password
function verifyPassword(oldPassword, newPassword){
    if (oldPassword == newPassword){
        alert("New password cannot be the same as the old pass")
        return false
    }
    return true
}

const saveButton = document.getElementById("save_button")

saveButton.addEventListener("click", (e) => {
    e.preventDefault()
    callAPI()
})