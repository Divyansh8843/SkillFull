const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Use simple mock database for development
const db = require("./config/database");

const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:8000",
      "http://localhost:8001",
    ],
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:8000",
      "http://localhost:8001",
    ],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);

// Health check endpoints
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    await db.executeQuery("SELECT 1");
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "SkillWave Backend API",
      database: "Connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "Service Unavailable",
      timestamp: new Date().toISOString(),
      service: "SkillWave Backend API",
      database: "Disconnected",
      error: error.message,
    });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    await db.executeQuery("SELECT 1");
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "SkillWave Backend API",
      database: "Connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "Service Unavailable",
      timestamp: new Date().toISOString(),
      service: "SkillWave Backend API",
      database: "Disconnected",
      error: error.message,
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "SkillWave Backend API is running",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Socket.io for real-time messaging
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_user", (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  socket.on("join_request", (requestId) => {
    socket.join(`request_${requestId}`);
    console.log(`User joined request room: request_${requestId}`);
  });

  socket.on("send_message", async (data) => {
    try {
      // Save message to database (implement in message controller)
      const message = await saveMessage(data);

      // Emit to request room
      socket.to(`request_${data.requestId}`).emit("new_message", message);

      // Send notification to receiver if online
      const receiverSocketId = activeUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", {
          type: "message_received",
          message: `New message from ${data.senderName}`,
          requestId: data.requestId,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.io server ready for connections`);
  });
}

// Export for Vercel
module.exports = app;

// Placeholder function for saving messages
async function saveMessage(data) {
  // This will be implemented in the message controller
  return {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString(),
  };
}

module.exports = { app, io };
