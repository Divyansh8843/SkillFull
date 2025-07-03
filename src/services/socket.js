import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(userId) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
      this.isConnected = true;
      this.socket.emit("join_user", userId);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinRequestRoom(requestId) {
    if (this.socket) {
      this.socket.emit("join_request", requestId);
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit("send_message", messageData);
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on("new_message", callback);
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on("notification", callback);
    }
  }

  offMessage() {
    if (this.socket) {
      this.socket.off("new_message");
    }
  }

  offNotification() {
    if (this.socket) {
      this.socket.off("notification");
    }
  }
}

export default new SocketService();
