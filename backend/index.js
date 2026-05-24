const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const { Server } = require("socket.io");

const authRoutes = require("./src/routes/auth.routes");
const { socketHandler } = require("./src/config/socket");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// socket setup
socketHandler(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});