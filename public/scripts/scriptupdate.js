<script>
    // Fetch user details from backend API endpoints
    fetch('/api/user') // Replace '/api/user' with your actual backend route for fetching user details
        .then(response => response.json())
        .then(userData => {
            // Update HTML elements with fetched user data
            document.getElementById('userName').textContent = userData.username;
            document.getElementById('userFullName').textContent = userData.fullName;
            document.getElementById('userEmail').textContent = userData.email;
            document.getElementById('userPhone').textContent = userData.phone;
            document.getElementById('userQualifications').textContent = userData.qualifications;
            document.getElementById('userPreferences').textContent = userData.preferences;
            document.getElementById('userStudyingDetails').textContent = userData.studyingDetails;
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
</script>