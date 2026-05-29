import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

const FloatingActionButton = () => {
  const location = useLocation();

  // Don't show the button if we are already on the report page
  if (location.pathname === '/report') return null;

  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link 
        to="/report" 
        className="flex items-center gap-2 bg-safe-orange hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-full shadow-[0_0_20px_rgba(245,166,35,0.5)] transition transform hover:-translate-y-1 hover:scale-105"
      >
        <PlusCircle size={24} />
        <span className="hidden md:inline">Report Animal</span>
      </Link>
    </motion.div>
  );
};

export default FloatingActionButton;
