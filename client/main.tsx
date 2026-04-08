import { createRoot } from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(<App />);

// Handle HMR (Hot Module Reloading) for Vite
if (import.meta.hot) {
  import.meta.hot.accept("./App", ({ App: UpdatedApp }) => {
    root.render(<UpdatedApp />);
  });
}
