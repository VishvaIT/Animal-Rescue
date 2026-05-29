import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    role: 'public',
    teamName: '',
    coverageArea: ''
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(res.data, res.data.token);
      toast.success('Registration successful! Welcome to SafePaws.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-panel p-8"
      >
        <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Join SafePaws Rescue</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-safe-blue transition"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Contact Number</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-safe-blue transition"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-safe-blue transition"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-safe-blue transition"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">I am joining as:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value="public" 
                  checked={formData.role === 'public'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="accent-safe-blue"
                />
                Public Reporter
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value="team" 
                  checked={formData.role === 'team'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="accent-safe-orange"
                />
                Rescue Team Member
              </label>
            </div>
          </div>

          {formData.role === 'team' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-safe-orange">Team / Organization Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-safe-orange/50 rounded-lg p-3 text-white focus:outline-none focus:border-safe-orange transition"
                  value={formData.teamName}
                  onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-safe-orange">Coverage Area</label>
                <input 
                  type="text" 
                  required
                  placeholder="City, District, etc."
                  className="w-full bg-white/5 border border-safe-orange/50 rounded-lg p-3 text-white focus:outline-none focus:border-safe-orange transition"
                  value={formData.coverageArea}
                  onChange={(e) => setFormData({...formData, coverageArea: e.target.value})}
                />
              </div>
            </motion.div>
          )}

          <button 
            type="submit" 
            className={`w-full font-bold py-3 rounded-lg shadow-lg transition transform hover:-translate-y-1 ${
              formData.role === 'team' ? 'bg-safe-orange hover:bg-orange-500' : 'bg-safe-blue hover:bg-blue-600'
            } text-white`}
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-safe-blue hover:underline">Log in here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
