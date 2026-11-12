import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Box, IconButton, InputBase, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "@fontsource/roboto/400.css";
import WeatherCard from "../components/WeatherCard/WeatherCard";
import "./popup.css";

function App() {
  const [cities, setCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState("");

  function handleAddCity() {
    const city = cityInput.trim();

    if (!city) return;

    if (
      cities.some(
        (existingCity) => existingCity.toLowerCase() === city.toLowerCase(),
      )
    ) {
      return;
    }

    setCities((previousCities) => [...previousCities, city]);
    setCityInput("");
  }

  function handleDeleteCity(index: number) {
    setCities((previousCities) => previousCities.filter((_, i) => i !== index));
  }

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Weather Extension
      </Typography>

      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1,
          mb: 2,
        }}
      >
        <InputBase
          placeholder="Add a city name"
          value={cityInput}
          onChange={(event) => setCityInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleAddCity();
            }
          }}
          sx={{ flex: 1 }}
        />

        <IconButton onClick={handleAddCity} aria-label="Add city">
          <AddIcon />
        </IconButton>
      </Paper>

      {cities.map((city, index) => (
        <WeatherCard
          key={city}
          city={city}
          tempScale="metric"
          onDelete={() => handleDeleteCity(index)}
        />
      ))}
    </Box>
  );
}

const root = document.createElement("div");
document.body.appendChild(root);

createRoot(root).render(<App />);
