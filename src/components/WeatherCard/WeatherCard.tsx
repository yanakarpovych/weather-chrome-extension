import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import AirIcon from "@mui/icons-material/Air";
import ThermostatIcon from "@mui/icons-material/Thermostat";

import {
  fetchOpenWeatherData,
  getWeatherIconSrc,
  type OpenWeatherData,
  type OpenWeatherTempScale,
} from "../../utils/api";

import "./WeatherCard.css";

interface WeatherCardProps {
  city: string;
  tempScale: OpenWeatherTempScale;
  onDelete?: () => void;
  deleteLabel?: string;
}

type WeatherCardState = "loading" | "error" | "ready";

function WeatherCard({
  city,
  tempScale,
  onDelete,
  deleteLabel = "Delete",
}: WeatherCardProps) {
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [cardState, setCardState] = useState<WeatherCardState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      setCardState("loading");

      try {
        const data = await fetchOpenWeatherData(city, tempScale);

        if (!cancelled) {
          setWeatherData(data);
          setCardState("ready");
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);

        if (!cancelled) {
          setCardState("error");
        }
      }
    }

    void loadWeather();

    return () => {
      cancelled = true;
    };
  }, [city, tempScale]);

  const temperatureUnit = tempScale === "metric" ? "°C" : "°F";

  const windUnit = tempScale === "metric" ? "m/s" : "mph";

  if (cardState === "loading") {
    return (
      <Card className="weather-card">
        <CardContent className="weather-card__loading">
          <CircularProgress size={28} />
          <Typography>Loading {city}...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (cardState === "error" || !weatherData) {
    return (
      <Card className="weather-card">
        <CardContent>
          <Typography color="error">
            Could not retrieve weather data for {city}.
          </Typography>
        </CardContent>

        {onDelete && (
          <CardActions>
            <Button onClick={onDelete}>{deleteLabel}</Button>
          </CardActions>
        )}
      </Card>
    );
  }

  const currentWeather = weatherData.weather[0];

  return (
    <Card className="weather-card" elevation={2}>
      <CardContent>
        <Box className="weather-card__header">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {weatherData.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: "capitalize" }}
            >
              {currentWeather?.description ?? "Weather"}
            </Typography>
          </Box>

          {currentWeather && (
            <img
              className="weather-card__icon"
              src={getWeatherIconSrc(currentWeather.icon)}
              alt={currentWeather.description}
            />
          )}
        </Box>

        <Typography variant="h3" className="weather-card__temperature">
          {Math.round(weatherData.main.temp)}
          {temperatureUnit}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box className="weather-card__details">
          <Chip
            icon={<ThermostatIcon />}
            label={`Feels like ${Math.round(
              weatherData.main.feels_like,
            )}${temperatureUnit}`}
            variant="outlined"
          />

          <Chip
            icon={<WaterDropOutlinedIcon />}
            label={`Humidity ${weatherData.main.humidity}%`}
            variant="outlined"
          />

          <Chip
            icon={<AirIcon />}
            label={`Wind ${weatherData.wind.speed} ${windUnit}`}
            variant="outlined"
          />
        </Box>
      </CardContent>

      {onDelete && (
        <CardActions>
          <Button size="small" color="error" onClick={onDelete}>
            {deleteLabel}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

export default WeatherCard;
