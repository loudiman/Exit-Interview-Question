document.addEventListener('DOMContentLoaded', () => {
    // DOM Element Caching
    const sidebarToggle = document.querySelector('#sidebarToggle');
    const sidebar = document.querySelector('#sidebar');
    const profileIconBtn = document.querySelector('#profile-icon-btn');
    const uploadModal = document.querySelector('#uploadModal');
    const closeModal = document.querySelector('#closeModal');
    const uploadForm = document.querySelector('#uploadForm');
    const logoutButton = document.querySelector('.logout-button');
    const logoutPrompt = document.querySelector('#logout-prompt');
    const cancelLogoutBtn = document.querySelector('#cancelLogoutBtn');
    const logOutBtn = document.querySelector('#logOut');
    const userNameElement = document.querySelector('h2');

    // Toggle sidebar visibility
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Profile Icon Button (To open the image upload modal)
    profileIconBtn.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    // Close Modal
    closeModal.addEventListener('click', () => {
        uploadModal.style.display = 'none';
    });

    // Handle Image Upload
    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const imageUpload = document.querySelector('#imageUpload').files[0];
    
        if (!imageUpload) return alert('Please select an image to upload.');
    
        // Create FormData object to hold the file
        const formData = new FormData();
        formData.append('file', imageUpload);
    
        try {
            // Make the API call
            const response = await fetch(uploadForm.action, {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                // Handle successful upload
                alert('Image uploaded successfully!');
            } else {
                // Handle server errors
                const errorData = await response.json();
                alert(`Failed to upload image: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error('Error uploading image:', error);
            alert('An error occurred while uploading the image. Please try again.');
        }
    
        // Close the modal after uploading
        uploadModal.style.display = 'none';
    });

    // Show logout prompt
    logoutButton.addEventListener('click', () => {
        logoutPrompt.style.display = 'block';
    });

    // Cancel logout
    cancelLogoutBtn.addEventListener('click', () => {
        logoutPrompt.style.display = 'none';
    });

    // Confirm logout
    logOutBtn.addEventListener('click', () => {
        alert('Logged out successfully!');
        // Perform actual logout logic here (like redirecting or clearing session)
        window.location.href = '/admin/login'; //TODO:Change to correct directory once done confirming with the group
    });

    // Close logout prompt when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!logoutPrompt.contains(event.target) && !logoutButton.contains(event.target)) {
            logoutPrompt.style.display = 'none';
        }
    });
});
