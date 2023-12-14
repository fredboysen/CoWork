document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
  
    //if buttons are present, add eventlistener
    const navbarLoginBtn = document.getElementById('navbarLoginBtn');
    const navbarLogoutBtn = document.getElementById('navbarLogoutBtn');
  
    if (navbarLoginBtn && navbarLogoutBtn) {
      navbarLoginBtn.addEventListener('click', toggleLoginOrLogout);
      navbarLogoutBtn.addEventListener('click', logout);
    }
    
});

//if user is not logged in show login button 
function showLoginButton() {
    const navbarLoginBtn = document.getElementById("navbarLoginBtn");
    const navbarLogoutBtn = document.getElementById("navbarLogoutBtn");
  
    if (navbarLoginBtn && navbarLogoutBtn) {
      navbarLoginBtn.style.display = "inline-block";
      navbarLogoutBtn.style.display = "none";
  
      navbarLoginBtn.addEventListener('click', toggleLoginOrLogout);
    } else {
      console.error("Button elements not found.");
    }
  }
  

//if user is logged in, show log  out button
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
  
  
  //Function to logout user
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
        checkLoginStatus();
  
        // Redirect to the appropriate page after logout
        window.location.href = '/login.html';
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
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
      return result || {}; // Returning result or an empty object if result is undefined
    } catch (error) {
      console.error("Error checking login status:", error);
      return {}; // Returning an empty object in case of an error
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
      window.location.href = '/login.html';
    }
  }