import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
};

const Report = () => {
  const [formData, setFormData] = useState({
    reporterName: '',
    contactNumber: '',
    animalType: '',
    injuryDescription: '',
    address: '',
    emergencyLevel: 'Medium',
    notes: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      return toast.error("Please select a location on the map");
    }
    if (!image) {
      return toast.error("Please upload an image of the animal");
    }

    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('lat', position.lat);
    data.append('lng', position.lng);
    data.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      await axios.post('http://localhost:5000/api/reports', data, config);
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/feed'); 
      }, 4000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-dark-bg z-[100]">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
          className="text-center z-10 p-8 glass-panel"
        >
          <div className="text-9xl mb-6">🐾</div>
          <h1 className="text-5xl font-bold gradient-text mb-4">Thank You!</h1>
          <p className="text-2xl text-white">Your report can save a life ❤️</p>
        </motion.div>
        
        {/* Floating Hearts */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl z-0"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100 
            }}
            animate={{ 
              y: -100,
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {i % 2 === 0 ? '❤️' : '✨'}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto glass-panel p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-center gradient-text">Report an Animal in Need</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Your Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-safe-blue transition"
                value={formData.reporterName}
                onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Animal Type (e.g., Dog, Cat, Bird)</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-safe-blue transition"
                value={formData.animalType}
                onChange={(e) => setFormData({...formData, animalType: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Emergency Level</label>
              <select 
                className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-safe-blue transition"
                value={formData.emergencyLevel}
                onChange={(e) => setFormData({...formData, emergencyLevel: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Injury Description</label>
            <textarea 
              required
              rows="3"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-safe-blue transition"
              value={formData.injuryDescription}
              onChange={(e) => setFormData({...formData, injuryDescription: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Upload Image</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center relative hover:bg-white/5 transition cursor-pointer">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {preview ? (
                <img src={preview} alt="Preview" className="mx-auto h-32 object-cover rounded-lg" />
              ) : (
                <div className="text-gray-400">
                  <p>Drag & drop or click to upload</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Location Details</label>
            <input 
              type="text" 
              placeholder="Nearest landmark, street name..."
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-safe-blue transition mb-4"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            <label className="block text-sm font-medium mb-2 text-gray-300">Pin Location on Map (Click to pin)</label>
            <div className="h-64 rounded-lg overflow-hidden border border-white/20 relative z-0">
              <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-safe-blue hover:bg-blue-600 text-white font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(74,144,226,0.3)] transition transform hover:-translate-y-1 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Rescue Report'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Report;
