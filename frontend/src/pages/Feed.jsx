import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import RescuePostCard from '../components/RescuePostCard';
import { toast } from 'react-toastify';
import { Activity } from 'lucide-react';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_rescue_post', (newPost) => {
      setPosts((prev) => [newPost, ...prev]);
      toast.info(`New Rescue Request: ${newPost.animalType} in need!`, {
        icon: '🚨'
      });
    });

    socket.on('rescue_status_updated', (updatedPost) => {
      setPosts((prev) => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
      if (updatedPost.status === 'Rescued') {
        toast.success(`A ${updatedPost.animalType} has been successfully rescued! 🎉`);
      }
    });

    socket.on('report_liked', ({ reportId, likes }) => {
      setPosts((prev) => prev.map(p => p._id === reportId ? { ...p, likes } : p));
    });

    return () => {
      socket.off('new_rescue_post');
      socket.off('rescue_status_updated');
      socket.off('report_liked');
    };
  }, [socket]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports');
      setPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load rescue feed');
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warn('Please login to like posts');
        return;
      }
      await axios.post(`http://localhost:5000/api/reports/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error liking post', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
        <div className="bg-safe-blue/20 p-3 rounded-full text-safe-blue">
          <Activity size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Live Rescue Feed</h1>
          <p className="text-gray-400">Real-time updates on animals needing help</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safe-orange"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {posts.map(post => (
            <RescuePostCard key={post._id} post={post} onLike={handleLike} />
          ))}
          {posts.length === 0 && (
            <div className="text-center text-gray-500 py-12 glass-panel">
              No rescue posts currently. Thank you for keeping the streets safe!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
