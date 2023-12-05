document.addEventListener("DOMContentLoaded", function () {
  checkLoginStatus();

  const navbarLoginBtn = document.getElementById('navbarLoginBtn');
  const navbarLogoutBtn = document.getElementById('navbarLogoutBtn');

  if (navbarLoginBtn && navbarLogoutBtn) {
    navbarLoginBtn.addEventListener('click', toggleLoginOrLogout);
    navbarLogoutBtn.addEventListener('click', logout);
  }

  const container = document.getElementById('container');
  const registerBtn = document.getElementById('register');
  const loginBtn = document.getElementById('login');

  registerBtn.addEventListener('click', () => {
    container.classList.add("active");
  });

  loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
  });
});


function toggleMenu() {
  const dropdownMenu = document.getElementById("dropdownMenu");
  if (dropdownMenu.style.display === "block") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "block";
  }
}


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
      const redirectTo = '/index.html'; // Change this to the desired redirect URL
      window.location.href = redirectTo;

      // Display a welcome message
      alert(`Welcome, ${name}! You have successfully registered.`);
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