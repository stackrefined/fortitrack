# FortiTrack – HVAC Dispatch Prototype

FortiTrack is a web-based dispatch tool designed for HVAC technicians and dispatch managers to track, manage, and monitor job assignments in real-time.

## Features

- Secure authentication (Firebase Auth)
- Role-based dashboard (Dispatch View)
- Real time tracking (Firestore)
- Status filtering with color-coded chips
- Mobile-responsive layout (Material UI)
- Animated transitions & polished UI
- Future-ready for GPS/location tracking

## Built With

- **React.js** – frontend framework
- **Firebase** – auth + real-time Firestore database
- **Material UI** – UI components
- **React Router** – routing and protection
- **Git/GitHub** – version control

## Demo
Pending deployment to Netlify.

This app currently runs locally.
To try it out:
1. Clone the repo
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Visit `http://localhost:3000` in your browser


## Authentication

Only authenticated users can access the dashboard via Firebase Auth. Protected routes ensure secure login before data is shown. 
Demo creds: Username---- admin@fortitrack.com      Password---- password

## Structure Overview
/public
  ├── index.html          # HTML template
  └── logo.png            # FortiTrack Logo

/src
  ├── components/
  │   └── JobCard.js      # Reusable job display component
  ├── pages/
  │   └── Dashboard.js    # Main dashboard showing job data
  ├── firebase.js         # Firebase configuration and Firestore setup
  ├── App.js              # Root component with routing and layout
  ├── index.js            # App entry point
  └── styles/
      └── custom.css      # Custom styles or theme overrides
