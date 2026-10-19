// Twin Cities Animal Rescue - Touchstone 4 JavaScript
// Handles the volunteer role tracker, form validation, and browser storage.

// ---------- Data ----------

// Array of objects: one object for each volunteer role
var roles = [
  { id: "dog-walker", name: "Dog walker" },
  { id: "cat-socializer", name: "Cat socializer" },
  { id: "event-helper", name: "Event helper" },
  { id: "transport-driver", name: "Transport driver" },
  { id: "admin-support", name: "Administrative support" }
];

// Array that stores the ids of the roles the user picked
var selectedRoles = [];

// ---------- Volunteer role tracker (services page) ----------

// Load the saved roles from localStorage
function loadRoles() {
  var saved = localStorage.getItem("selectedRoles");
  if (saved) {
    selectedRoles = JSON.parse(saved);
  }
}

// Save the picked roles to localStorage
function saveRoles() {
  localStorage.setItem("selectedRoles", JSON.stringify(selectedRoles));
}

// Create one button for each role in the roles array
function buildRoleButtons() {
  var container = document.getElementById("role-buttons");
  if (!container) {
    return; // not on the services page
  }
  for (var i = 0; i < roles.length; i++) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = roles[i].name;
    btn.className = "role-btn";
    btn.setAttribute("data-role", roles[i].id);
    btn.addEventListener("click", toggleRole);
    container.appendChild(btn);
  }
}

// Runs each time a role button is clicked
function toggleRole(event) {
  var roleId = event.target.getAttribute("data-role");
  var index = selectedRoles.indexOf(roleId);
  if (index === -1) {
    selectedRoles.push(roleId); // add the role
  } else {
    selectedRoles.splice(index, 1); // remove the role
  }
  saveRoles();
  updateRoleDisplay();
}

// Turn a role id into its display name
function getRoleName(roleId) {
  for (var i = 0; i < roles.length; i++) {
    if (roles[i].id === roleId) {
      return roles[i].name;
    }
  }
  return roleId;
}

// Update the buttons and the summary text on the page
function updateRoleDisplay() {
  var buttons = document.querySelectorAll(".role-btn");
  for (var i = 0; i < buttons.length; i++) {
    var roleId = buttons[i].getAttribute("data-role");
    if (selectedRoles.indexOf(roleId) !== -1) {
      buttons[i].classList.add("selected");
    } else {
      buttons[i].classList.remove("selected");
    }
  }

  var summary = document.getElementById("role-summary");
  if (!summary) {
    return; // not on the services page
  }
  if (selectedRoles.length === 0) {
    summary.textContent = "You have not selected any roles yet.";
  } else {
    var names = [];
    for (var j = 0; j < selectedRoles.length; j++) {
      names.push(getRoleName(selectedRoles[j]));
    }
    summary.textContent = "You selected " + selectedRoles.length + " role(s): " + names.join(", ") + ".";
  }
}

// ---------- Contact form (contact page) ----------

function setupForm() {
  var form = document.getElementById("interest-form");
  if (!form) {
    return; // not on the contact page
  }

  // Pre-fill the name and email saved from a previous visit
  var savedName = localStorage.getItem("volunteerName");
  var savedEmail = localStorage.getItem("volunteerEmail");
  if (savedName) {
    document.getElementById("name").value = savedName;
  }
  if (savedEmail) {
    document.getElementById("email").value = savedEmail;
  }

  // Show the roles the user saved on the services page
  var savedRoles = localStorage.getItem("selectedRoles");
  if (savedRoles) {
    var picked = JSON.parse(savedRoles);
    if (picked.length > 0) {
      var names = [];
      for (var i = 0; i < picked.length; i++) {
        names.push(getRoleName(picked[i]));
      }
      document.getElementById("picked-roles").textContent =
        "Roles you saved on our services page: " + names.join(", ") + ".";
    }
  }

  form.addEventListener("submit", validateForm);
}

// Show an error message near a field
function showError(id, message) {
  document.getElementById(id).textContent = message;
}

// Clear all error messages before checking again
function clearErrors() {
  var errors = document.querySelectorAll(".error");
  for (var i = 0; i < errors.length; i++) {
    errors[i].textContent = "";
  }
}

// Check the form when the user clicks submit
function validateForm(event) {
  event.preventDefault(); // stop the form from submitting
  clearErrors();
  var valid = true;

  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();

  // Check 1: name is required, at least 2 characters
  if (name.length < 2) {
    showError("name-error", "Please enter your full name (at least 2 characters).");
    valid = false;
  }

  // Check 2: email must look like an email address
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    showError("email-error", "Please enter a valid email address, like name@example.com.");
    valid = false;
  }

  // Check 3: message must be at least 10 characters
  if (message.length < 10) {
    showError("message-error", "Please tell us a little more (at least 10 characters).");
    valid = false;
  }

  // If everything passed, save the details and show a thank you message
  if (valid) {
    localStorage.setItem("volunteerName", name);
    localStorage.setItem("volunteerEmail", email);
    document.getElementById("form-success").textContent =
      "Thank you, " + name + "! Your interest form is complete. We will contact you at " + email + " within two business days.";
  }
}

// ---------- Run when the page loads ----------

loadRoles();
buildRoleButtons();
updateRoleDisplay();
setupForm();