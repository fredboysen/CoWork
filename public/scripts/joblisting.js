function openPostJobModal() {
    const postJobModal = document.getElementById('postJobModal');
    if (postJobModal) {
      postJobModal.style.display = 'block';
    }
  }
  
  function closePostJobModal() {
    const postJobModal = document.getElementById('postJobModal');
    if (postJobModal) {
      postJobModal.style.display = 'none';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
  
    const navbarLoginBtn = document.getElementById('navbarLoginBtn');
    const navbarLogoutBtn = document.getElementById('navbarLogoutBtn');
  
    if (navbarLoginBtn && navbarLogoutBtn) {
      navbarLoginBtn.addEventListener('click', toggleLoginOrLogout);
      navbarLogoutBtn.addEventListener('click', logout);
    }
    fetchAndDisplayJobListings();

  const postJobForm = document.getElementById('postJobForm');
  postJobForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const jobTitle = document.getElementById('jobTitle').value;
    const location = document.getElementById('location').value;
    const keySkills = document.getElementById('keySkills').value;
    const jobDesc = document.getElementById('jobDesc').value;

    try {
      // Make an asynchronous request to the server to create a job
      const response = await fetch('/post-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle, location, keySkills, jobDesc }),
      });

      const result = await response.json();

      // Handle the result
      if (result.success) {
        console.log('Job application posted successfully');
        // You can do something with the result, e.g., show a success message
      } else {
        console.error('Job application posting failed:', result.message);
        // Handle job application posting failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error posting job application:', error);
      // Handle other errors (e.g., network issues)
    } finally {
      // Close the modal or perform any other necessary cleanup
      closePostJobModal();
    }
  })
  });


  async function fetchAndDisplayJobListings() {
    try {
      const response = await fetch('/get-job-listings');
      const result = await response.json();
  
      if (result.success) {
        const jobListingsContainer = document.getElementById('jobListings');
  
        jobListingsContainer.innerHTML = '';
  
        result.jobListings.forEach((job) => {
          const jobCard = document.createElement('div');
          jobCard.className = 'job_card';
  
          jobCard.innerHTML = `
            <div class="job_details">
              <div class="img">
                <!-- Add your icon or image here -->
              </div>
              <div class="text">
                <h2>${job.jobTitle}</h2>
                <span>${job.location} - ${job.keySkills}</span>
              </div>
            </div>
            <div class="job_salary">
              <h4>${job.salary}</h4>
              <span>${job.postedDate}</span>
            </div>
          `;
  
          jobListingsContainer.appendChild(jobCard);
        });
      } else {
        console.error('Error fetching job listings:', result.message);
      }
    } catch (error) {
      console.error('Error fetching job listings:', error);
    }
  }
  