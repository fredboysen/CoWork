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

  function redirectToProfile() {
    // Perform any necessary login validation or actions here

    // Redirect to profile2.html after form submission
    window.location.href = "profile2.html";
    return false; // Prevent the default form submission
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

