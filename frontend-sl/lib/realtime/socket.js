let socket = null;
let isConnected = false;
<<<<<<< HEAD
let listeners = new Set();

export function connectSocket(onMessage, onStatusChange) {
  if (socket) return socket;

  socket = new WebSocket("wss://your-api.com/ws");
=======

export function connectSocket(onMessage, onStatusChange) {
  // 🔥 prevent duplicate connection
  if (socket && isConnected) return socket;

  const WS_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("http", "ws") + "/ws";

  socket = new WebSocket(WS_URL);
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b

  socket.onopen = () => {
    isConnected = true;
    onStatusChange?.(true);
<<<<<<< HEAD
    console.log("🔌 Socket connected");
=======
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
<<<<<<< HEAD
    } catch {}
=======
    } catch (err) {}
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
  };

  socket.onclose = () => {
    isConnected = false;
    onStatusChange?.(false);
    socket = null;
<<<<<<< HEAD
    console.log("❌ Socket disconnected");
=======

    // 🔁 auto reconnect
    setTimeout(() => {
      connectSocket(onMessage, onStatusChange);
    }, 3000);
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
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
