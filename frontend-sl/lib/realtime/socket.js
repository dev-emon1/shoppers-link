let socket = null;
let isConnected = false;

export function connectSocket(onMessage, onStatusChange) {
  // 🔥 prevent duplicate connection
  if (socket && isConnected) return socket;

  const WS_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("http", "ws") + "/ws";

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    isConnected = true;
    onStatusChange?.(true);
    console.log("🔌 Socket connected:", WS_URL);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("🔥 SOCKET EVENT:", data); // 👈 debug
      onMessage?.(data);
    } catch (err) {
      console.log("Socket parse error:", err);
    }
  };

  socket.onclose = () => {
    isConnected = false;
    onStatusChange?.(false);
    socket = null;
    console.log("❌ Socket disconnected");

    // 🔁 auto reconnect
    setTimeout(() => {
      connectSocket(onMessage, onStatusChange);
    }, 3000);
  };

  socket.onerror = () => {
    isConnected = false;
    onStatusChange?.(false);
    console.log("⚠️ Socket error");
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
