function openPostJob() {
    const postJob = document.getElementById('postJob');
    if (postJob) {
      postJob.style.display = 'block';
    }
  }
  
  function closePostJob() {
    const postJob = document.getElementById('postJob');
    if (postJob) {
      postJob.style.display = 'none';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
  
    closePostJob();
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
      const companyName = document.getElementById('companyName').value;
      const location = document.getElementById('location').value;
      const keySkills = document.getElementById('keySkills').value;
      const jobDesc = document.getElementById('jobDesc').value;
      const pdfLink = document.getElementById('pdfLink').value;
  
      try { 
        // Make an asynchronous request to the server to create a job
        const response = await fetch('/post-application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobTitle, companyName, location, keySkills, jobDesc, pdfLink }),
        });
  
        const result = await response.json();
  
        // Handle the result
        if (result.success) {
          console.log('Job application posted successfully');
          alert(`Job has been successfully posted!`);
          window.location.href = '/joblisting.html';
        } else {
          console.error('Job application posting failed:', result.message);
          alert(`Permission Denied`);

        }
      } catch (error) {
        console.error('Error posting job application:', error);
        // Handle other errors (e.g., network issues)
      }
    });
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
  <div class="jobDesc">
    <div class="text">
      <h2>${job.jobtitle}</h2>
      <span>${job.location} - ${job.keyskills}</span>
    </div>
  </div>
  <div class="companyName">
    <h4>${job.companyname}</h4>
    <span>${job.created_at}</span>
    <p>${job.jobdesc}</p>
    <a href="${job.pdflink}" class ="pdfLink" "type="url" target="_blank">Read more</a>
    <!-- Add link for jobPostingLink if needed -->
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


  
