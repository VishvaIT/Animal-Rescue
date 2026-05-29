import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import FloatingActionButton from './components/FloatingActionButton';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Feed from './pages/Feed';
import PostDetails from './pages/PostDetails';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 text-white font-sans">
            <Navbar />
            <div className="pt-20">
              <Routes>
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                <Route path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />
                <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
            <FloatingActionButton />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

