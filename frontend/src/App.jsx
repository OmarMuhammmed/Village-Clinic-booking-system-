import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';

import PatientLanding from './pages/PatientLanding';
import PatientBooking from './pages/PatientBooking';
import PatientTicket from './pages/PatientTicket';
import Dashboard from './pages/Dashboard';

// ── Layout ────────────────────────────────────────────────────────
const AppLayout = () => (
  <div className="app-shell">
    <ScrollRestoration />
    <main className="page-container">
      <Outlet />
    </main>
  </div>
);

// Dashboard has its own wider container
const DashboardLayout = () => (
  <div className="app-shell">
    <ScrollRestoration />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
  </div>
);

// ── Router ─────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/',                    element: <PatientLanding /> },
      { path: '/book/:doctorId',      element: <PatientBooking /> },
      { path: '/ticket/:ticketId',    element: <PatientTicket /> },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
]);

function App() {
  return (
    <QueueProvider>
      <RouterProvider router={router} />
    </QueueProvider>
  );
}

export default App;
