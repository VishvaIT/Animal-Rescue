import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Heart, MessageCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmergencyBadge = ({ level }) => {
  const colors = {
    Low: 'bg-green-500/20 text-green-400 border-green-500/50',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    High: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    Critical: 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
  };

  return (
    <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${colors[level] || colors.Low}`}>
      {level === 'Critical' && <AlertTriangle size={14} />}
      {level}
    </span>
  );
};

const RescuePostCard = ({ post, onLike }) => {
  const isEmergency = post.emergencyLevel === 'Critical' || post.emergencyLevel === 'High';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel overflow-hidden transition-all duration-300 hover:shadow-xl ${isEmergency ? 'border-red-500/30' : ''}`}
    >
      <div className="relative h-64 overflow-hidden group">
        <img 
          src={`http://localhost:5000${post.imageUrl}`} 
          alt={post.animalType} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <EmergencyBadge level={post.emergencyLevel} />
          <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm ${post.status === 'Rescued' ? 'text-safe-green border-safe-green' : 'text-white border-white/20'}`}>
            {post.status}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1 capitalize">{post.animalType} Rescue</h3>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <Clock size={14} /> {new Date(post.createdAt).toLocaleString()} by {post.reporterName}
            </p>
          </div>
        </div>

        <p className="text-gray-300 mb-4 line-clamp-2">{post.injuryDescription}</p>

        <div className="flex items-center gap-2 text-gray-400 mb-6 text-sm bg-black/20 p-3 rounded-lg">
          <MapPin size={16} className="text-safe-blue" />
          <span className="truncate">{post.location?.address}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex gap-4">
            <button onClick={() => onLike(post._id)} className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition">
              <Heart size={20} className={post.likes?.length > 0 ? "fill-pink-500 text-pink-500" : ""} />
              <span>{post.likes?.length || 0}</span>
            </button>
            <Link to={`/post/${post._id}`} className="flex items-center gap-2 text-gray-400 hover:text-safe-blue transition">
              <MessageCircle size={20} />
              <span>{post.comments?.length || 0}</span>
            </Link>
          </div>
          
          <Link to={`/post/${post._id}`} className="bg-safe-orange hover:bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-bold transition shadow-[0_0_10px_rgba(245,166,35,0.3)]">
            Respond to Rescue
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RescuePostCard;
