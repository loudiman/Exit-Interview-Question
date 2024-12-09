async function callAPI(){

    //This is for debug purposes please uncomment this later on
    sessionStorage.setItem("username","2233915")

    console.log("function has been called")
    const old_password = document.getElementById("old_password").value
    const new_password = document.getElementById("new_password").value

    // Guard clause for new password being the same for the old password
    if(!verifyPassword(old_password, new_password)){
        return
    }

    const localUsername = sessionStorage.getItem("username")
    const response = await fetch(`http://localhost:2019/api/user-service/user/${localUsername}`,{
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

    if(!response.ok){
        alert("Password was not changed")
        return
    }

    alert("Password successfully changed")
    console.log(`Old Pass: ${old_password} and New Pass: ${new_password}`)
    return
}

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