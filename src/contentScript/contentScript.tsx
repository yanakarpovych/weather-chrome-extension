
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import WeatherCard from "../components/WeatherCard/WeatherCard";
import {
  getStoredOptions,
  type LocalStorageOptions,
} from "../utils/storage";
import { Messages } from "../utils/messages";
import "./contentScript.css";

function App() {
  const [options, setOptions] =
    useState<LocalStorageOptions | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getStoredOptions()
      .then((storedOptions) => {
        if (cancelled) return;

        setOptions(storedOptions);
        setIsActive(
          storedOptions.hasAutoOverlay &&
          Boolean(storedOptions.homeCity.trim())
        );
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleMessage(message: unknown) {
      if (message === Messages.TOGGLE_OVERLAY) {
        setIsActive((previous) => !previous);
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  if (!options || !isActive || !options.homeCity.trim()) {
    return null;
  }

  return (
    <div className="weather-extension-overlay">
      <WeatherCard
        city={options.homeCity}
        tempScale={options.tempScale}
        onDelete={() => setIsActive(false)}
        deleteLabel="Close"
      />
    </div>
  );
}

const root = document.createElement("div");
root.id = "weather-extension-root";
document.body.appendChild(root);

createRoot(root).render(<App />);
