# FortiTrack – HVAC Dispatch Platform

FortiTrack is a modern, real-time dispatch and job tracking platform for HVAC teams. Built with React and Firebase, it enables seamless job assignment, technician tracking, and workflow management with a polished, enterprise-grade user experience.

---

## Key Features

- **Secure Authentication & Role-Based Access**  
  Firebase Auth with admin, dispatcher, and technician roles.
- **Real-Time Job Management**  
  Live job creation, assignment, and status updates via Firestore listeners.
- **User Management Dashboard**  
  Admins can add, edit, and deactivate users from a sleek UI.
- **Technician Workflow**  
  Technicians see only their jobs and can update status in real time.
- **Modern, Branded UI**  
  - Unique, airy blue gradients and glassmorphism-inspired cards
  - Consistent, clear text with bold, modern fonts for readability and a professional look
  - Pill-shaped buttons, animated transitions, and micro-interactions
  - Responsive layouts for mobile and desktop
- **Audit Trail**  
  Tracks who created/updated jobs and when.
- **Continuous Deployment**  
  Automatic deploys via GitHub Actions to Firebase Hosting.

---

## Technology Stack

- **React.js** – Frontend framework
- **Firebase** – Authentication & Firestore database
- **Material UI** – Modern UI components
- **React Router** – Routing and dashboard protection
- **GitHub Actions** – CI/CD for automatic deploys

---

## Business Value

- **Boosts Field Efficiency:** Real-time collaboration between dispatchers and technicians
- **Cloud-Native Reliability:** Secure, scalable, and always up-to-date
- **Enterprise-Ready UI:** Professional, branded, and delightful to use
- **Modular & Extensible:** Easily add features like GPS, analytics, or notifications

---

## Live Demo

[https://hvac-dispatch-e3e2a.web.app](https://hvac-dispatch-e3e2a.web.app)

---

## Quick Start

```sh
git clone https://github.com/stackrefined/fortitrack.git
cd fortitrack
npm install
npm start
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Authentication

Only authenticated users can access the dashboard.

**Demo credentials:**  
- **Admin:**  
  - Username: `admin@fortitrack.com`  
  - Password: `password`
- **Technician:**  
  - Username: `mike.tech@fortitrack.com`  
  - Password: `password`
- **Dispatcher:**  
  - Username: `jane.dispatch@fortitrack.com`  
  - Password: `password`

---

## Project Structure

```
/public
  ├── index.html
  └── logo.png

/src
  ├── components/
  │   ├── JobCreationForm.js
  │   ├── JobsTable.js
  │   ├── TechnicianJobs.js
  │   ├── AdminUsersTab.js
  ├── pages/
  │   └── Dashboard.jsx
  │   └── Login.jsx
  ├── firebase.js
  ├── App.js
  ├── index.js
  └── styles/
      └── custom.css
```

---

## UI & UX Highlights

- **Unique, Modern Look:**  
  Soft blue gradients, glassy cards, and subtle shadows for a refreshing feel.
- **Consistent, Clear Text:**  
  All dashboard text uses bold, modern fonts for better readability and a professional look.
- **Responsive & Accessible:**  
  Mobile-first layouts, large touch targets, and accessible color choices.
- **Micro-Interactions:**  
  Animated button feedback, smooth tab transitions, and hover effects.
- **No Layout Shift:**  
  Animated terminal text on login page reserves space, keeping forms stable.

---

## Roadmap

- GPS/location tracking for technicians
- Push notifications for job updates
- Enhanced admin analytics dashboard
- Offline support for field teams

---

## About the Author

**Stack Refined (Thomas W.)**  
Full Stack Developer | Cloud Solutions | Field Service Technology

For questions or collaboration, please email: [stackrefined.dev@proton.me](mailto:stackrefined.dev@proton.me)

---

This project demonstrates scalable, real-time web solutions for field service operations with a focus on modern UI/UX and cloud-native best practices.
