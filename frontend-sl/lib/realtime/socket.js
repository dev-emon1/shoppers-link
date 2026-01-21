let socket = null;
let isConnected = false;
let listeners = new Set();

export function connectSocket(onMessage, onStatusChange) {
  if (socket) return socket;

  socket = new WebSocket("wss://your-api.com/ws");

  socket.onopen = () => {
    isConnected = true;
    onStatusChange?.(true);
    console.log("🔌 Socket connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    } catch {}
  };

  socket.onclose = () => {
    isConnected = false;
    onStatusChange?.(false);
    socket = null;
    console.log("❌ Socket disconnected");
  };

  socket.onerror = () => {
    isConnected = false;
    onStatusChange?.(false);
  };

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function getSocketStatus() {
  return isConnected;
}
