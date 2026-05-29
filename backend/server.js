const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Socket.io for Real-time Updates
const io = new Server(server, {
  cors: {
    origin: '*', // We will restrict this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Database Connection
const cleanMongoUri = (uri) => {
  if (!uri) return uri;
  return uri
    .replace(/[?&](useNewUrlParser|useUnifiedTopology|ssl)=([^&]*)/gi, '')
    .replace(/\?&/, '?')
    .replace(/[?&]$/,'');
};

mongoose.connect(cleanMongoUri(process.env.MONGO_URI))
  .then(() => {
    console.log('MongoDB connected successfully');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('SafePaws Rescue API is running...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
