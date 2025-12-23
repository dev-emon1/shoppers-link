export const showToast = (message, type = "success", options = {}) => {
  if (typeof window === "undefined") return;

  const { duration = 4000, actionText = null, onAction = null } = options;

  const toast = document.createElement("div");

  toast.className = `
    fixed bottom-6 right-6 z-[9999]
    flex items-center gap-3
    px-4 py-3 rounded-lg shadow-lg
    text-white text-sm font-medium
    animate-fadeIn
    ${
      type === "error"
        ? "bg-red"
        : type === "warning"
        ? "bg-yellow text-black"
        : "bg-main"
    }
  `;

  const msg = document.createElement("span");
  msg.textContent = message;
  toast.appendChild(msg);

  // 🔹 Action button (Undo, Retry, etc.)
  if (actionText && typeof onAction === "function") {
    const btn = document.createElement("button");
    btn.textContent = actionText;
    btn.className = `
      ml-2 underline font-semibold
      hover:opacity-80
    `;

    btn.onclick = () => {
      onAction();
      toast.remove();
    };

    toast.appendChild(btn);
  }

  document.body.appendChild(toast);

  const timeout = setTimeout(() => {
    toast.classList.add("animate-fadeOut");
    setTimeout(() => toast.remove(), 300);
  }, duration);

  // Cleanup if user clicks action
  toast.onclick = () => {
    clearTimeout(timeout);
  };
};
