import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { SocketContext } from '../context/SocketContext';
import { MapPin, Clock, ArrowLeft, Send } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [afterImage, setAfterImage] = useState(null);
  const [previewAfter, setPreviewAfter] = useState(null);
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    
    socket.on('rescue_status_updated', (updatedPost) => {
      if (updatedPost._id === id) {
        setPost(updatedPost);
        toast.info(`Rescue status updated to: ${updatedPost.status}`);
      }
    });

    socket.on('report_commented', ({ reportId, comment }) => {
      if (reportId === id) {
        setPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), comment]
        }));
      }
    });

    return () => {
      socket.off('rescue_status_updated');
      socket.off('report_commented');
    };
  }, [socket, id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports');
      const found = res.data.find(p => p._id === id);
      setPost(found);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load post details');
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.warn('Please login to comment');

      await axios.post(`http://localhost:5000/api/reports/${id}/comment`, 
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to post comment');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterImage(file);
      setPreviewAfter(URL.createObjectURL(file));
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus) return toast.warn('Please select a status');
    if (newStatus === 'Rescued' && !afterImage) return toast.warn('Please upload a post-rescue photo');

    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.warn('Please login to update status');

      const formData = new FormData();
      formData.append('status', newStatus);
      if (updateNotes) formData.append('updateNotes', updateNotes);
      if (afterImage) formData.append('afterImage', afterImage);

      await axios.put(`http://localhost:5000/api/reports/${id}/status`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Status updated successfully');
      setNewStatus('');
      setUpdateNotes('');
      setAfterImage(null);
      setPreviewAfter(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safe-orange"></div>
    </div>
  );

  if (!post) return <div className="min-h-screen pt-24 text-center">Post not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-5xl mx-auto px-4">
      <Link to="/feed" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition w-fit">
        <ArrowLeft size={20} /> Back to Feed
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img 
                src={`http://localhost:5000${post.imageUrl}`} 
                alt={post.animalType} 
                className={`w-full ${post.afterImageUrl ? 'h-64' : 'h-96'} object-cover`}
              />
              {post.afterImageUrl && (
                <div className="relative">
                  <div className="absolute top-4 left-4 bg-safe-green text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">After Rescue</div>
                  <img 
                    src={`http://localhost:5000${post.afterImageUrl}`} 
                    alt={`${post.animalType} after rescue`} 
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold capitalize">{post.animalType} Rescue</h1>
                <span className="px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md font-bold uppercase text-sm">
                  {post.status}
                </span>
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {post.injuryDescription}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-xl flex items-start gap-3">
                  <MapPin className="text-safe-blue shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm text-gray-400 font-medium">Location</h4>
                    <p>{post.location?.address}</p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl flex items-start gap-3">
                  <Clock className="text-safe-orange shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm text-gray-400 font-medium">Reported At</h4>
                    <p>{new Date(post.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-gray-400 mt-1">By {post.reporterName}</p>
                  </div>
                </div>
              </div>
              
              {post.notes && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                  <h4 className="text-sm font-medium text-yellow-500 mb-1">Additional Notes</h4>
                  <p className="text-gray-300">{post.notes}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8">
            <h3 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Community Support ({post.comments?.length || 0})</h3>
            
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {post.comments?.map((comment, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-safe-blue">{comment.userName}</span>
                    <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-200 text-sm">{comment.text}</p>
                </div>
              ))}
              {(!post.comments || post.comments.length === 0) && (
                <p className="text-gray-500 text-center py-4">Be the first to show support!</p>
              )}
            </div>

            <form onSubmit={handleComment} className="flex gap-2">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a supportive comment..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-safe-blue transition"
              />
              <button type="submit" className="bg-safe-blue hover:bg-blue-600 text-white p-3 rounded-full transition shadow-lg">
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Sidebar / Timeline */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6">
            <h3 className="text-xl font-bold mb-6">Rescue Progress</h3>
            
            <div className="relative pl-6 border-l-2 border-white/10 space-y-8">
              {['Pending', 'Team Assigned', 'Rescue In Progress', 'Rescued'].map((step, index) => {
                const statusOrder = ['Pending', 'Team Assigned', 'Rescue In Progress', 'Rescued', 'Treatment Ongoing', 'Completed'];
                const currentIdx = statusOrder.indexOf(post.status);
                const stepIdx = statusOrder.indexOf(step);
                
                let dotColor = 'bg-gray-600 border-gray-700';
                let textColor = 'text-gray-500';
                
                if (currentIdx >= stepIdx) {
                  dotColor = 'bg-safe-green border-safe-green shadow-[0_0_10px_rgba(80,227,194,0.5)]';
                  textColor = 'text-white font-medium';
                }
                
                if (currentIdx === stepIdx) {
                  dotColor = 'bg-safe-blue border-safe-blue animate-pulse shadow-[0_0_15px_rgba(74,144,226,0.8)]';
                }

                return (
                  <div key={step} className="relative">
                    <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${dotColor}`}></div>
                    <p className={`text-sm ${textColor}`}>{step}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {user?.role === 'team' && post.status === 'Pending' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-4 text-safe-orange">Rescue Action</h3>
              <p className="text-gray-400 text-sm mb-6">If you are a registered rescue team member, you can accept this emergency call.</p>
              <button 
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    if (!token) return toast.warn('Please login');
                    const formData = new FormData();
                    formData.append('status', 'Team Assigned');
                    await axios.put(`http://localhost:5000/api/reports/${id}/status`, formData, {
                      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                    });
                    toast.success('You have successfully accepted this rescue case!');
                  } catch (err) {
                    toast.error('Failed to accept rescue case');
                  }
                }}
                className="w-full bg-safe-orange hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition shadow-[0_0_15px_rgba(245,166,35,0.4)]"
              >
                Accept Rescue Case
              </button>
            </motion.div>
          )}

          {user?.role === 'team' && post.status !== 'Pending' && post.status !== 'Completed' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-4 text-safe-orange">Update Rescue Status</h3>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">New Status</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-safe-orange transition"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Rescue In Progress">Rescue In Progress</option>
                    <option value="Treatment Ongoing">Treatment Ongoing</option>
                    <option value="Rescued">Mark as Rescued</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {newStatus === 'Rescued' && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Post-Rescue Photo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-safe-orange/20 file:text-safe-orange hover:file:bg-safe-orange/30 transition"
                    />
                    {previewAfter && (
                      <img src={previewAfter} alt="Preview" className="mt-2 h-24 object-cover rounded-lg border border-white/10" />
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Update Notes (Optional)</label>
                  <textarea 
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    rows="2"
                    className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-safe-orange transition"
                    placeholder="E.g., Animal is safe, taken to vet..."
                  />
                </div>

                <button type="submit" className="w-full bg-safe-orange hover:bg-orange-500 text-white font-bold py-2 rounded-lg transition shadow-[0_0_15px_rgba(245,166,35,0.4)]">
                  Update Status
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
