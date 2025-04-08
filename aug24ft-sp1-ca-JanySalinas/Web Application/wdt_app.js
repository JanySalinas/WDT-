let staffMembersList = [];
let deliveryList = [];
let selectedStaff;
let selectedDeliveryStaff;
let selectedDeliveryStaffIndex;

class Employee {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }
}
class Delivery extends Employee {
  constructor(name, surname, vehicle, telephone, address, returnTime) {
    super(name, surname)
    this.vehicle = vehicle;
    this.telephone = telephone;
    this.address = address;
    this.returnTime = returnTime;
  }

  showLateToast() {
    const returnTime = this.returnTime ?? Date.now();
    const elapsedTime = Date.now() - returnTime;

    const formattedTime = new Date(elapsedTime).toISOString().substr(11, 8); // HH:mm:ss format

    return `
        <div class="d-flex align-items-center">
            <div>
                <strong> Delivery driver: ${this.name} ${this.surname} is late! </strong>
               <p> Vehicle: ${this.vehicle} </p>
               <p>Phone number: ${this.telephone} </p>
               <p>Adress:${this.address}</p>
                <p>Should have been back by: ${returnTime.toLocaleTimeString()}</p>
            </div>
        </div>
    `;
  }

  createLateToast() {
    if (!this.lateToastElement) {
      const toastContainer = document.getElementById('toast-container');
      const toastElement = document.createElement('div');
      toastElement.className = 'toast text-bg-danger border-0';
      toastElement.setAttribute('data-bs-autohide', 'false');
      toastElement.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">Late Alert</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">${this.showLateToast()}</div>
        `;
      this.lateToastElement = toastElement;

      toastContainer.appendChild(toastElement);

      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement);
      toastBootstrap.show();
    }
  }
  update() {
    // if (this.returnTime && this.lateToastElement) {
    //   this.lateToastElement.querySelector('.toast-body').innerHTML = this.showLateToast();
    // }

    if (Date.now() > this.returnTime) {
      this.createLateToast();
    }
  }
}

// Staff Class for OOP
class Staff extends Employee {
  // static instances = new Set();
  constructor(picture, name, surname, email) {
    super(name, surname)
    this.picture = picture;
    this.email = email;
    this.status = "In";
    this.outTime = "-";
    this.duration = "-";
    this.expectedReturn = "-";
    // Staff.instances.add(this);
  }

  toTableRow() {
    return `
      <tr data-email="${this.email}">
        <td><img src="${this.picture}" alt="${this.name}" style="width:50px;border-radius:50%;"></td>
        <td>${this.name}</td>
        <td>${this.surname}</td>
        <td>${this.email}</td>
        <td class="status">${this.status}</td>
        <td class="out-time">${this.outTime}</td>
        <td class="duration">${this.duration}</td>
        <td class="expected-return">${this.expectedReturn}</td>
      </tr>
    `;
  }

  showLateToast() {
    const lateAt = this.lateAt ?? Date.now();
    const elapsedTime = Date.now() - lateAt;

    const formattedTime = new Date(elapsedTime).toISOString().substr(11, 8); // HH:mm:ss format

    return `
        <div class="d-flex align-items-center">
            <img src="${this.picture}" alt="${this.name}" style="width:40px; height:40px; border-radius:50%; margin-right:10px;">
            <div>
                <strong>${this.name} ${this.surname} is late!</strong>
                <p>Late by: ${formattedTime}</p>
            </div>
        </div>
    `;
  }

  createLateToast() {
    if (!this.lateToastElement) {
      const toastContainer = document.getElementById('toast-container');
      const toastElement = document.createElement('div');
      toastElement.className = 'toast text-bg-danger border-0';
      toastElement.setAttribute('data-bs-autohide', 'false');
      toastElement.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">Late Alert</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">${this.showLateToast()}</div>
        `;
      this.lateToastElement = toastElement;

      toastContainer.appendChild(toastElement);

      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement);
      toastBootstrap.show();
    }
  }

  update() {
    if (this.lateAt && this.lateToastElement) {
      this.lateToastElement.querySelector('.toast-body').innerHTML = this.showLateToast();
    }

    if (!this.lateAt && this.shouldReturnAt && Date.now() > this.shouldReturnAt) {
      this.lateAt = Date.now();
      this.createLateToast();
    }
  }
}



// Fetch Random Users from the API
async function fetchRandomUsers(count) {
  const response = await fetch(`https://randomuser.me/api/?results=${count}`);
  const data = await response.json();
  console.log(data.results)
  return data.results;
}

// Populate Staff Table
async function staffUserGet() {
  console.log("Fetching random users...");
  const staffTableBody = document.getElementById("staff-table-body");
  if (!staffTableBody) {
    console.error("Staff table body not found!");
    return;
  }

  const users = await fetchRandomUsers(5); // Fetch 5 random users
  console.log(users); // Debugging: Log fetched users

  users.forEach((user) => {
    const staff = new Staff(
      user.picture.medium,
      user.name.first,
      user.name.last,
      user.email
    );
    staffMembersList.push(staff);
    staffTableBody.insertAdjacentHTML("beforeend", staff.toTableRow());
  });

  console.log("Staff table populated.");
  addRowEventListeners();
}

// Add Event Listeners to Staff Table Rows
function addRowEventListeners() {
  document.querySelectorAll("#staff-table-body tr").forEach((row) => {
    row.addEventListener("click", () => handleRowClick(row));
  });
}
function handleRowClickDelivery(row) {
  // Deselect all other rows
  document.querySelectorAll("#delivery-table-body tr").forEach((otherRow) => {
    otherRow.style.backgroundColor = ""; // Reset other rows' background
  });


  // Change the clicked row's background color to green
  row.style.backgroundColor = "green";

  // Optionally, reset the background color of other rows if you want only one row to be green at a time
  document.querySelectorAll("#staff-table-body tr").forEach((otherRow) => {
    if (otherRow !== row) {
      otherRow.style.backgroundColor = ""; // Reset other rows' background
    }
  });

  const email = row.getAttribute("data-email");
  // filter staff member array by email to get who is been clicked on.
  let staff = staffMembersList.filter(s => s.email === email)[0];
  console.log(staff);

  // const staff = getStaffByRow(row);

  // Save the clicked staff to update the status using the In/Out buttons
  selectedStaff = staff;
}

// Handle Clock Out (Out button)
function handleClockOut() {
  if (selectedStaff) {
    const durationMinutes = prompt("Enter the length of absence in minutes:");
    const currentTime = new Date();

    selectedStaff.status = "Out";
    selectedStaff.outTime = currentTime.toLocaleTimeString();
    selectedStaff.duration = `${durationMinutes} minutes`;
    selectedStaff.expectedReturn = new Date(currentTime.getTime() + durationMinutes * 60000).toLocaleTimeString();
    selectedStaff.shouldReturnAt = currentTime.getTime() + durationMinutes * 60000;
    selectedStaff.lateAt = undefined;

    // Update table
    const row = document.querySelector(`[data-email="${selectedStaff.email}"]`);
    row.querySelector(".status").textContent = selectedStaff.status;
    row.querySelector(".out-time").textContent = selectedStaff.outTime;
    row.querySelector(".duration").textContent = selectedStaff.duration;
    row.querySelector(".expected-return").textContent = selectedStaff.expectedReturn;
  }
}

// Handle Clock In (In button)
function handleClockIn() {
  if (selectedStaff) {
    selectedStaff.status = "In";
    selectedStaff.outTime = "-";
    selectedStaff.duration = "-";
    selectedStaff.expectedReturn = "-";
    selectedStaff.shouldReturnAt = undefined;
    selectedStaff.lateAt = undefined;
    // selectedStaff.destroyLateToast.bind(selectedStaff);
    // selectedStaff.destroyLateToast();

    const row = document.querySelector(`[data-email="${selectedStaff.email}"]`);
    row.querySelector(".status").textContent = selectedStaff.status;
    row.querySelector(".out-time").textContent = selectedStaff.outTime;
    row.querySelector(".duration").textContent = selectedStaff.duration;
    row.querySelector(".expected-return").textContent = selectedStaff.expectedReturn;
  }
}

// Set up button event listeners
document.getElementById("in-button").addEventListener("click", handleClockIn);
document.getElementById("out-button").addEventListener("click", handleClockOut);

function updateCurrentTime() {
  const currentTimeElement = document.getElementById("current-time");

  if (!currentTimeElement) {
    console.error("Element with id 'current-time' not found.");
    return;
  }

  setInterval(() => {
    const now = new Date();
    currentTimeElement.textContent = now.toLocaleString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, 1000);
}


function initDeliveryForm() {
  const deliveryForm = document.getElementById("schedule-delivery-form");
  if (deliveryForm) {
    deliveryForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent form submission to allow manual row insertion

      // Retrieve data from the form
      const vehicle = this.elements["vehicle"].value;
      const name = this.elements["name"].value;
      const surname = this.elements["surname"].value;
      const phone = this.elements["telephone"].value;
      const address = this.elements["address"].value;
      // Format the return time
      const rawReturnTime = this.elements["returnTime"].value;
      const [hours, minutes] = rawReturnTime.split(':');
      const now = new Date();
      const returnTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      // const returnTime = formatReturnTime(rawReturnTime);

      const deliveryStaff = new Delivery(
        name,
        surname,
        vehicle,
        phone,
        address,
        returnTime
      );

      deliveryList.push(deliveryStaff);
      updateTableDelivery();

      // Reset the form after submission
      this.reset();
      addRowEventListenersDelivery();
    });
  }

}

function updateTableDelivery() {
  const tbody = document.querySelector("#delivery-table-body");
  tbody.innerHTML = "";

  deliveryList.forEach((delivery) => {
    const row = document.createElement("tr");
    row.setAttribute("data-name", delivery.name);
    row.innerHTML = `
      <td><img src="${getVehicleImage(delivery.vehicle)}" alt="${delivery.vehicle}" style="width:40px; height:40px;" /></td>
      <td>${delivery.name}</td>
      <td>${delivery.surname}</td>
      <td>${delivery.telephone}</td>
      <td>${delivery.address}</td>
      <td>${formatReturnTime(delivery.returnTime)}</td>
    `;
    tbody.appendChild(row);
  });

  // Reattach event listeners to the new rows
  addRowEventListenersDelivery();
}
// Add Event Listeners to Staff Table Rows
function addRowEventListeners() {
  document.querySelectorAll("#staff-table-body tr").forEach((row) => {
    row.addEventListener("click", () => handleRowClickStaff(row));
  });
}

function addRowEventListenersDelivery() {
  document.querySelectorAll("#delivery-table-body tr").forEach((row) => {
    row.addEventListener("click", () => handleRowClickDelivery(row));
  });
}

const clearButton = document.getElementById("clear-delivery");
clearButton.addEventListener("click", function () {
  if (selectedDeliveryStaff) {
    const confirmDelete = confirm("Are you sure you want to remove this delivery?");
    if (confirmDelete) {
      // Remove the selected delivery from the list
      deliveryList.splice(selectedDeliveryStaffIndex, 1);
      // Update the table display
      updateTableDelivery();
      // Clear the selection
      selectedDeliveryStaff = null;
      selectedDeliveryStaffIndex = null;
    }
  } else {
    alert("Please select a delivery to remove.");
  }
});



// Helper function to return the correct image path based on vehicle type
function getVehicleImage(vehicleType) {
  let imageSrc = '';
  if (vehicleType === "Car") {
    imageSrc = 'images/car-icon.png'; // Path to your car image
  } else if (vehicleType === "Motorcycle") {
    imageSrc = 'images/motorcycle-icon.png'; // Path to your motorcycle image
  }
  return imageSrc;
}

// Format the return time
function formatReturnTime(rawTime) {
  if (!rawTime) return "-"; // Handle empty input

  const date = new Date(rawTime); // Convert raw time to a Date object
  if (isNaN(date)) return rawTime; // If invalid, return raw time as-is

  // Format the return time into a readable string
  return date.toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


// Initialize the delivery form when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initDeliveryForm();
});


document.addEventListener("DOMContentLoaded", () => {
  updateCurrentTime();
});

// Initialize functions on page load
document.addEventListener("DOMContentLoaded", () => {
  staffUserGet();
});

function updateStaffStatuses() {
  staffMembersList.forEach((staff) => staff.update());
}

function updateDeliveryStatuses() {
  deliveryList.forEach((delivery) => delivery.update());
}

setInterval(updateStaffStatuses, 1000);
setInterval(updateDeliveryStatuses, 1000);


// Add Event Listeners to Staff Table Rows
function addRowEventListenersDelivery() {
  document.querySelectorAll("#delivery-table-body tr").forEach((row) => {
    row.addEventListener("click", () => handleRowClickDelivery(row));
  });
}

// Handle Row Click for Staff Table
function handleRowClickStaff(row) {
  // Deselect all other rows
  document.querySelectorAll("#staff-table-body tr").forEach((otherRow) => {
    otherRow.style.backgroundColor = ""; // Reset other rows' background
  });

  // Highlight the selected row
  row.style.backgroundColor = "green";

  const email = row.getAttribute("data-email");

  // Find the selected staff member based on email
  selectedStaffIndex = staffMembersList.findIndex(
    (staff) => staff.email === email
  );
  selectedStaff = staffMembersList[selectedStaffIndex];
  console.log("Selected Staff:", selectedStaff);
}
// Handle Row Click
function handleRowClickDelivery(row) {
  console.log(row);

  // Change the clicked row's background color to green
  row.style.backgroundColor = "green";

  // Optionally, reset the background color of other rows if you want only one row to be green at a time
  document.querySelectorAll("#delivery-table-body tr").forEach((otherRow) => {
    if (otherRow !== row) {
      otherRow.style.backgroundColor = ""; // Reset other rows' background
    }
  });

  const name = row.getAttribute("data-name");
  console.log(name);

  selectedDeliveryStaffIndex = deliveryList.findIndex(delivery => delivery.name === name);
  console.log(selectedDeliveryStaffIndex);


  // filter staff member array by name to get who is been clicked on.
  let deliveryStaff = deliveryList.filter(s => s.name === name)[0];
  console.log(deliveryStaff);

  // const staff = getStaffByRow(row);

  // Save the clicked staff to update the status using the In/Out buttons
  selectedDeliveryStaff = deliveryStaff;
}
