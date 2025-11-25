import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useState } from 'react';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePageWrapper />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/app"
                        element={
                            <ProtectedRoute>
                                <MapPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

// Wrapper to handle the "Get Started" transition logic if needed, 
// or simply redirect to /app when clicked.
const HomePageWrapper = () => {
    const [redirect, setRedirect] = useState(false);

    if (redirect) {
        return <Navigate to="/app" replace />;
    }

    return <HomePage onGetStarted={() => setRedirect(true)} />;
};

export default App;


