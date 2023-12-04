$.get("xml/person.xml", function (xml, status) {
  var firstname = $(xml).find("firstname");
  var displayName = $(firstname[0]).text();
  $("#textField1").html(displayName);
});



function toggleMenu() {
    const dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu.style.display === "block") {
      dropdownMenu.style.display = "none";
    } else {
      dropdownMenu.style.display = "block";
    }
  }


  document.addEventListener("DOMContentLoaded", function() {
    // Your script here
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


function updateProfilePage(userData) {
  // Update the user-related elements in profile2.html
  document.getElementById('userName').textContent = userData.name;
  document.getElementById('userEmail').textContent = userData.email;
  document.getElementById('userRole').textContent = userData.role;

  // Optionally, you can perform additional actions after updating the profile page
  console.log('Profile page updated with user data:', userData);
}

// JavaScript function to handle registration form submission
async function submitRegistrationForm(event) {
  event.preventDefault(); // Prevent the default form submission
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const phone = document.getElementById('register-phone').value;  // This corresponds to 'phone'
  const role = document.getElementById('register-role').value;
  
  const response = await fetch('/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone, role }),
  });
  

  const result = await response.json();

  // Handle the result as needed (e.g., redirect or show an error)
  if (result.success) {
      console.log('Registration successful');
      // Redirect to the profile page or wherever you want
  } else {
      console.error('Registration failed:', result.message);
      // Handle registration failure (e.g., show an error message)
  }
  window.location.href = '/profile2.html'; 
}

// Your script here
async function submitLoginForm(event) {
  event.preventDefault(); // Prevent the default form submission

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    // Handle the result as needed
    if (result.success) {
      console.log('Login successful');
      
      // Update the profile page with user data
      updateProfilePage(result.userData);

      // Debugging: Log the redirection
      console.log('Redirecting to profile2.html');

      // Redirect to the specified page
      window.location.replace('/profile2.html');
    
    } else {
      console.error('Login failed:', result.message);
      // Handle login failure (e.g., show an error message)
    }
  } catch (error) {
    console.error('Error during login:', error);
    // Handle other errors (e.g., network issues)
  }
}
