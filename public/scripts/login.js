document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();

    const container = document.getElementById('container');
  const registerBtn = document.getElementById('register');
  const loginBtn = document.getElementById('login');
  
    if (registerBtn && loginBtn) {
        registerBtn.addEventListener('click', () => {
          container.classList.add("active");
        });
    
        loginBtn.addEventListener('click', () => {
          container.classList.remove("active");
        });
      }
    });



async function submitRegistrationForm(event) {
    event.preventDefault();
    //taking values from form input
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const phone = document.getElementById('register-phone').value;  
    const role = document.getElementById('register-role').value;
  
    try {
   // creating a post request to '/register' with form data

      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, role }),
      });
  
      const result = await response.json();
  
      // Handling the result
      if (result.success) {
        console.log('Registration successful');
        // Redirecting to the profile page
        const redirectTo = '/login.html';
        window.location.href = redirectTo;
  
        // Welcome message if succesful
        alert(`Welcome, ${name}! You have successfully registered. Please login to start your CoWorking Journey!`);
      } else {
        console.error('Registration failed:', result.message);

        alert(`Registration failed: ${result.message}`);
      }
        checkLoginStatus();
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration. Please try again.');
    }
  }
  
  
  async function submitLoginForm(event) {
    event.preventDefault();
  // taking value from form inputs
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    try {
  
      // requesting a post request to '/login' with login credentials

      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        checkLoginStatus();
  
        const redirectTo = result.redirectTo || "/index.html";
        window.location.assign(redirectTo);
        alert(`Welcome Back! You have successfully logged in.`);
      } else {
        console.error("Login failed:", result.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    
  }

  // Get the elements by their unique IDs
  const goBackButtons = document.querySelectorAll(".goBackButton");

  // Add event listeners to handle click events for each button
  goBackButtons.forEach(button => {
      button.addEventListener("click", function() {
          window.history.back();
      });
  });
  
