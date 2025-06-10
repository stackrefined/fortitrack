# FortiTrack – HVAC Dispatch Prototype

FortiTrack is a modern, real-time dispatch platform designed for HVAC teams. Built with React and Firebase, it streamlines job assignment, technician tracking, and workflow management for field service organizations.

---

## Key Features

- Secure authentication with role-based access (Firebase Auth)
- Real-time job management and updates (Firestore listeners)
- Technician dashboard with personalized job lists and status actions
- Status filtering with color-coded indicators
- Mobile-responsive interface (Material UI)
- Animated transitions and branded visuals
- Architecture supports future GPS/location tracking and analytics

---

## Technology Stack

- React.js – Frontend framework
- Firebase – Authentication and real-time Firestore database
- Material UI – UI components
- React Router – Routing and dashboard protection
- Git/GitHub – Version control

---

## Business Value

- Improves field efficiency by enabling real-time collaboration between dispatchers and technicians
- Cloud-native stack ensures reliability and data security
- Modular codebase and cloud backend support rapid feature expansion

---

## Demo

Deployment to Netlify is pending.

To run locally:

```sh
git clone https://github.com/yourusername/fortitrack.git
cd fortitrack
npm install
npm start
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Authentication

Only authenticated users can access the dashboard.

Demo credentials:  
- **Dispatcher:**  
  - Username: `admin@fortitrack.com`  
  - Password: `password`
- **Technician:**  
  - Username: `mike.tech@fortitrack.com`  
  - Password: `password`

---

## Project Structure

```
/public
  ├── index.html
  └── logo.png

/src
  ├── components/
  │   └── JobCard.js
  ├── pages/
  │   └── Dashboard.jsx
  ├── firebase.js
  ├── App.js
  ├── index.js
  └── styles/
      └── custom.css
```

---

## Roadmap

- GPS/location tracking for technicians
- Push notifications for job updates
- Admin dashboard for user and role management
- Offline support for field teams

---

## About the Author

**Stack Refined (Thomas W.)**  
Full Stack Developer | Cloud Solutions | Field Service Technology

For questions or collaboration, please email: [stackrefined.dev@proton.me](mailto:stackrefined.dev@proton.me)

---

This project demonstrates scalable, real-time web solutions for field service operations.
