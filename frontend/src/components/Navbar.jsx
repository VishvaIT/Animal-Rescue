import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed w-full z-50 glass-panel py-4 px-6 top-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold gradient-text">
          <Heart className="text-safe-orange" />
          SafePaws
        </Link>
        <div className="flex gap-6 items-center font-medium">
          <Link to="/" className="hover:text-safe-green transition">Home</Link>
          <Link to="/feed" className="hover:text-safe-green transition">Live Feed</Link>
          <Link to="/report" className="hover:text-safe-green transition">Report Animal</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 hover:text-safe-green transition">
                <User size={18} /> Dashboard
              </Link>
              <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition">
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-safe-blue hover:bg-blue-600 text-white px-5 py-2 rounded-full transition shadow-[0_0_15px_rgba(74,144,226,0.5)]">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
