import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const endpoint = user.role === 'team' || user.role === 'admin' 
          ? 'http://localhost:5000/api/reports' 
          : 'http://localhost:5000/api/reports/my-reports';
        
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchReports();
    }
  }, [user]);

  if (!user) return <div className="pt-24 text-center">Loading...</div>;

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Dashboard ({user.role})</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <motion.div 
              key={report._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6"
            >
              {report.imageUrl && (
                <img src={`http://localhost:5000${report.imageUrl}`} alt="Animal" className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <h3 className="text-xl font-bold mb-2">{report.animalType}</h3>
              <p className="text-gray-300 text-sm mb-2 line-clamp-2">{report.injuryDescription}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  report.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  report.status === 'Completed' ? 'bg-safe-green/20 text-safe-green' :
                  'bg-safe-blue/20 text-safe-blue'
                }`}>
                  {report.status}
                </span>
                <span className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
          {reports.length === 0 && (
            <p className="text-gray-400 col-span-full">No reports found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
