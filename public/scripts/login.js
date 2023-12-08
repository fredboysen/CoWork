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
    event.preventDefault(); // Prevent the default form submission
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const phone = document.getElementById('register-phone').value;  // This corresponds to 'phone'
    const role = document.getElementById('register-role').value;
  
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, role }),
      });
  
      const result = await response.json();
  
      // Handle the result
      if (result.success) {
        console.log('Registration successful');
        // Redirect to the profile page or wherever you want
        const redirectTo = '/login.html'; // Change this to the desired redirect URL
        window.location.href = redirectTo;
  
        // Display a welcome message
        alert(`Welcome, ${name}! You have successfully registered. Please login to start your CoWorking Journey!`);
      } else {
        console.error('Registration failed:', result.message);
        // Handle registration failure (e.g., show an error message)
        alert(`Registration failed: ${result.message}`);
      }
  
      // Check and update login status after registration
      checkLoginStatus();
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle other errors (e.g., network issues)
      alert('Error during registration. Please try again.');
    }
  }
  
  async function toggleLoginOrLogout() {
    // Check if the user is logged in
    const result = await checkLoginStatus();
    if (result.success && result.isLoggedIn) {
      // If the user is logged in, initiate the logout process
      logout();
    } else {
      // If the user is not logged in, proceed with the login functionality
      toggleLogin();
      window.location.href = '/login.html';
    }
  }
  
  async function submitLoginForm(event) {
    event.preventDefault(); // Prevent the default form submission
  
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      // Handle the result as needed
      if (result.success) {
        // Check and update login status
        checkLoginStatus();
  
        // Redirect to the specified page
        const redirectTo = result.redirectTo || "/index.html";
        window.location.assign(redirectTo);
        alert(`Welcome Back! You have successfully logged in.`);
      } else {
        console.error("Login failed:", result.message);
        // Handle login failure (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle other errors (e.g., network issues)
    }
    
  }

document.getElementById("goBack").addEventListener("click", function() {
    window.history.back(); // This will take the user back to the previous page
});
  

  