import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const App = lazy(() => import("./App.jsx"));

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-lg font-medium">
          Loading...
        </div>
      }
    >
      <App />
    </Suspense>
  </BrowserRouter>
);
