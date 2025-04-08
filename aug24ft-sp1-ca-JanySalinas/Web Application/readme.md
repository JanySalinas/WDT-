# Reception Management Dashboard

## Introduction
The Reception Management Dashboard is a web application for tracking staff attendance, managing deliveries, and providing real-time notifications. Designed with Bootstrap, JavaScript, and jQuery, this app offers an intuitive interface to enhance office operations.

## Features
- **Staff Management**: Log staff "in" and "out" using external buttons.
- **Delivery Tracking**: Manage deliveries with input validation.
- **Real-time Notifications**: Toast notifications for late staff and other events.
- **Live Clock**: Displays the current date and time dynamically.
- **Responsive Design**: Built with Bootstrap for mobile and desktop compatibility.

## Folder Structure
├── index.html # Main HTML file ├── css/ │ └── styles.css # Custom CSS for the application ├── js/ │ ├── app.js # Main JavaScript file │ └── utils.js # Helper functions ├── images/ │ └── logo.png # Company logo ├── data/ │ └── staff.json # Demo staff data ├── README.md # Project documentation

## Installation Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/noroff-backend-1/aug24ft-sp1-ca-JanySalinas.git
   cd repo-name

2. **Open the Application:**

Open index.html in any modern web browser.

3. **Install External Libraries:**

**The application uses the following libraries:**
Bootstrap: Included via CDN.
jQuery: Included via CDN.
No additional installation is required as all dependencies are loaded via CDNs.

Usage

**Staff Management:**

1. Use the "In" and "Out" buttons to log staff attendance.
Click a row in the staff table to toggle between active (green) and inactive (default) states.

2. **Delivery Tracking:**

Use the form to add deliveries with proper input validation.

3. **Toast Notifications:**

Notifications appear automatically for specific events, such as late staff members.

4. **Live Clock:**
 The clock at the top of the page updates in real-time.
