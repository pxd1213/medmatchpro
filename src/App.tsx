import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { theme } from './theme';

// Pages
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import ConsultantDashboard from './pages/ConsultantDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/manufacturer/*"
              element={
                <ProtectedRoute role="manufacturer">
                  <ManufacturerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultant/*"
              element={
                <ProtectedRoute role="consultant">
                  <ConsultantDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default App;
