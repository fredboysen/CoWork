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






