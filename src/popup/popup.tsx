import { createRoot } from "react-dom/client";
import "./popup.css"

function App() {
  return (
    <div>
      <img src="icon.png" alt="Weather Extension" />
    </div>
  );
}

const root = document.createElement("div");
document.body.appendChild(root);

createRoot(root).render(<App />);
