import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import PatientLanding from './pages/PatientLanding';
import PatientBooking from './pages/PatientBooking';
import PatientTicket from './pages/PatientTicket';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const AppLayout = () => (
  <div className="app-shell">
    <ScrollRestoration />
    <main className="page-container" style={{ maxWidth: 'none', padding: 0 }}>
      <Outlet />
    </main>
  </div>
);

const DashboardLayout = () => (
  <div className="app-shell">
    <ScrollRestoration />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/',                    element: <PatientLanding /> },
      { path: '/login',               element: <Login /> },
      { path: '/book/:doctorId',      element: <PatientBooking /> },
      { path: '/ticket/:ticketId',    element: <PatientTicket /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <QueueProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueueProvider>
  );
}

export default App;
