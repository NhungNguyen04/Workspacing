const cors = require('cors');
const express = require('express');
const http = require('http'); // Required to attach Socket.IO to the server
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Task = require('./src/models/taskModel');
const routes = require('./src/routes/route');

const app = express();
const port = process.env.PORT || 3033;

// Create an HTTP server using Express
const server = http.createServer(app);

// Set up Socket.IO and attach it to the HTTP server
const { Server } = require('socket.io');
const { deflate } = require('zlib');
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins, you can customize this to specific origins
        methods: ["GET", "POST"]
    }
});

// Set up CORS
app.use(cors());

// Configure Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/workspacing', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define routes
routes(app);

// Default 404 handler
app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for a custom event from clients
    socket.on('send changes', (delta) => {
        console.log('changes', delta);
        // Emit the message to all connected clients
        socket.broadcast.emit("received changes", delta)
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
server.listen(port, () => {
    console.log('Workspacing RESTful API server started on: ' + port);
    process.send = process.send || function () {};
    process.send('ready');
});
