# FortiTrack

FortiTrack is a field service and job management platform designed for dispatchers, technicians, and admins. It leverages React and Firebase to provide real-time job assignment, workflow tracking, GPS logging, diagnostics, and robust audit trails.

---

## Features

- **Job Assignment & Confirmation:**  
  Dispatchers assign jobs to technicians, who must confirm receipt before starting.

- **Job Workflow:**  
  Supports granular statuses (Assigned, Enroute, Arrived, Job Started, Job Completed, Cancelled) and workflow fields (start location, materials needed, estimated completion, closing notes).

- **Change & Audit Logging:**  
  Every significant job action (status change, reassignment, field update) is logged in subcollections for full traceability.

- **Real-Time GPS Tracking:**  
  Technician locations are tracked and stored in real time while jobs are in progress.

- **Diagnostics Dashboard:**  
  Admins/dispatchers can view jobs needing attention (pending confirmation, overdue, or stuck).

- **Bulk Data Entry:**  
  (Planned) Import jobs in bulk via JSON or Excel.

- **Error Logging:**  
  (Planned) Client-side errors are logged for diagnostics.

---

## Date/Time Handling

- **Storage:**  
  All timestamps are stored in UTC using Firestore's `serverTimestamp()` or Firestore Timestamp fields.

- **Display:**  
  All dates/times are displayed in the user's local timezone using JavaScript's `.toLocaleString()` method.

- **Advanced Formatting:**  
  For more advanced formatting, you can use the `date-fns` library.

---

## Data Model

- **jobs** (collection): Main job documents.
  - **changes** (subcollection): Audit/history of job changes.
  - **audit** (subcollection): Full audit trail of all actions.
  - **locations** (subcollection): GPS updates for the job.

- **users** (collection): User profiles and roles.

---

## Security

- All sensitive actions are protected by Firestore security rules.
- Only authenticated users can read/write jobs, changes, audits, and locations.
- Role-based access for admins, dispatchers, and technicians.

---

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Set up your Firebase project and update `src/firebase.js` with your config.
3. Run the app:
   ```bash
   npm start
   ```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## About the Author

**Stack Refined (Thomas W.)**  
Full Stack Developer | Cloud Solutions | Field Service Technology

For questions or collaboration, please email: [stackrefined.dev@proton.me](mailto:stackrefined.dev@proton.me)

---

This project demonstrates scalable, real-time web solutions for field service operations with a focus on modern UI/UX and cloud-native best practices.
