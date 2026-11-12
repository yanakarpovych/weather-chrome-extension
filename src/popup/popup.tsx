import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Box, IconButton, InputBase, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PictureInPictureIcon from "@mui/icons-material/PictureInPicture";
import "@fontsource/roboto/400.css";

import WeatherCard from "../components/WeatherCard/WeatherCard";
import {
  getStoredCities,
  getStoredOptions,
  setStoredCities,
  setStoredOptions,
  type LocalStorageOptions,
} from "../utils/storage";
import { Messages } from "../utils/messages";

import "./popup.css";

function App() {
  const [cities, setCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState("");
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStoredData() {
      try {
        const [storedCities, storedOptions] = await Promise.all([
          getStoredCities(),
          getStoredOptions(),
        ]);

        setCities(storedCities);
        setOptions(storedOptions);
      } catch (error) {
        console.error("Failed to load stored data:", error);
        setError("Failed to load saved settings.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadStoredData();
  }, []);

  async function handleAddCity() {
    const city = cityInput.trim();

    if (!city) return;

    if (
      cities.some(
        (existingCity) => existingCity.toLowerCase() === city.toLowerCase(),
      )
    ) {
      return;
    }

    const updatedCities = [...cities, city];

    try {
      await setStoredCities(updatedCities);
      setCities(updatedCities);
      setCityInput("");
      setError("");
    } catch (error) {
      console.error("Failed to save city:", error);
      setError("Failed to save city.");
    }
  }

  async function handleDeleteCity(cityToDelete: string) {
    const updatedCities = cities.filter((city) => city !== cityToDelete);

    try {
      await setStoredCities(updatedCities);
      setCities(updatedCities);
      setError("");
    } catch (error) {
      console.error("Failed to delete city:", error);
      setError("Failed to delete city.");
    }
  }

  async function handleTempScaleChange() {
    if (!options) return;

    const updatedOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === "metric" ? "imperial" : "metric",
    };

    try {
      await setStoredOptions(updatedOptions);
      setOptions(updatedOptions);
      setError("");
    } catch (error) {
      console.error("Failed to save temperature scale:", error);
      setError("Failed to save temperature scale.");
    }
  }

  async function handleOverlayToggle() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        setError("No active tab found.");
        return;
      }

      await chrome.tabs.sendMessage(tab.id, Messages.TOGGLE_OVERLAY);

      setError("");
    } catch (error) {
      console.error("Failed to toggle overlay:", error);

      setError(
        "Overlay is unavailable on this page. Try reloading a regular website.",
      );
    }
  }

  if (isLoading) {
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!options) {
    return (
      <Box p={2}>
        <Typography color="error">
          {error || "Could not load settings."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Weather Extension
      </Typography>

      <Box display="flex" gap={1} mb={2}>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            px: 1,
          }}
        >
          <InputBase
            placeholder="Add a city name"
            value={cityInput}
            onChange={(event) => setCityInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleAddCity();
              }
            }}
            sx={{ flex: 1 }}
          />

          <IconButton
            onClick={() => void handleAddCity()}
            aria-label="Add city"
          >
            <AddIcon />
          </IconButton>
        </Paper>

        <Paper>
          <IconButton
            onClick={() => void handleTempScaleChange()}
            aria-label="Change temperature scale"
            sx={{ width: 48, height: 48 }}
          >
            {options.tempScale === "metric" ? "°C" : "°F"}
          </IconButton>
        </Paper>

        <Paper>
          <IconButton
            onClick={() => void handleOverlayToggle()}
            aria-label="Toggle weather overlay"
            sx={{ width: 48, height: 48 }}
          >
            <PictureInPictureIcon />
          </IconButton>
        </Paper>
      </Box>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {options.homeCity && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}

      {cities.map((city) => (
        <WeatherCard
          key={city}
          city={city}
          tempScale={options.tempScale}
          onDelete={() => void handleDeleteCity(city)}
        />
      ))}
    </Box>
  );
}

const root = document.createElement("div");
document.body.appendChild(root);

createRoot(root).render(<App />);
