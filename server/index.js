const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => res.send('API Running'));

// API routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/mentors', require('./routes/mentorRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));



// Create HTTP server & bind Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // adjust as needed for prod
    methods: ['GET', 'POST']
  }
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', ({ userId }) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    const Message = require('./models/Message');
    const msg = await Message.create({ sender: senderId, receiver: receiverId, message });
    io.to(receiverId).emit('receiveMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
