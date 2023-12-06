document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
  
    const navbarLoginBtn = document.getElementById('navbarLoginBtn');
    const navbarLogoutBtn = document.getElementById('navbarLogoutBtn');
  
    if (navbarLoginBtn && navbarLogoutBtn) {
      navbarLoginBtn.addEventListener('click', toggleLoginOrLogout);
      navbarLogoutBtn.addEventListener('click', logout);
    }
    
});


function showLoginButton() {
    const navbarLoginBtn = document.getElementById("navbarLoginBtn");
    const navbarLogoutBtn = document.getElementById("navbarLogoutBtn");
  
    if (navbarLoginBtn && navbarLogoutBtn) {
      navbarLoginBtn.style.display = "inline-block";
      navbarLogoutBtn.style.display = "none";
  
      // Add an event listener to the login button
      navbarLoginBtn.addEventListener('click', toggleLoginOrLogout);
    } else {
      console.error("Button elements not found.");
    }
  }
  


function showLogoutButton() {
    const navbarLoginBtn = document.getElementById("navbarLoginBtn");
    const navbarLogoutBtn = document.getElementById("navbarLogoutBtn");
  
    if (navbarLoginBtn && navbarLogoutBtn) {
      navbarLoginBtn.style.display = "none";
      navbarLogoutBtn.style.display = "inline-block";
    } else {
      console.error("Button elements not found.");
    }
  }
  
  function toggleLogin() {
    var loginForm = document.getElementById('loginForm');
    if (loginForm && loginForm.style) { // Check if loginForm and loginForm.style exist
      if (loginForm.style.display === 'block') {
        loginForm.style.display = 'none';
      } else {
        loginForm.style.display = 'block';
      }
    } else {
      console.error('Login form not found.');
    }
  }
  
  async function logout() {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
  
      if (result.success) {
        console.log("Logout successful");
        // Check and update login status
        checkLoginStatus();
  
        // Redirect to the appropriate page after logout
        window.location.href = '/login.html';
      } else {
        console.error("Logout failed:", result.message);
        // Handle logout failure (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle other errors (e.g., network issues)
    }
  }
  
  async function checkLoginStatus() {
    try {
      const response = await fetch("/check-login-status");
      const result = await response.json();
  
      if (result && result.success && result.isLoggedIn) {
        // User is logged in, show logout button
        showLogoutButton();
      } else {
        // User is not logged in, show login button
        showLoginButton();
      }
      return result || {}; // Return result or an empty object if result is undefined
    } catch (error) {
      console.error("Error checking login status:", error);
      return {}; // Return an empty object in case of an error
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