import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Handles animated page transitions and routing
function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// Root app wraps everything with snackbar support and routing
export default function RootApp() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <App />
      </Router>
    </SnackbarProvider>
  );
}
