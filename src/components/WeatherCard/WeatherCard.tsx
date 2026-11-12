import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
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
}

type WeatherCardState = "loading" | "error" | "ready";

function WeatherCard({ city, tempScale, onDelete }: WeatherCardProps) {
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
      } catch {
        if (!cancelled) {
          setCardState("error");
        }
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [city, tempScale]);

  return (
    <Card className="weather-card">
      <CardContent>
        {cardState === "loading" && <Typography>Loading {city}...</Typography>}

        {cardState === "error" && (
          <Typography color="error">
            Could not retrieve weather data for {city}.
          </Typography>
        )}

        {cardState === "ready" && weatherData && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography className="weatherCard-title">
                {weatherData.name}
              </Typography>

              <Typography className="weatherCard-temp">
                {Math.round(weatherData.main.temp)}
                {tempScale === "metric" ? "°C" : "°F"}
              </Typography>

              <Typography className="weatherCard-body">
                Feels like {Math.round(weatherData.main.feels_like)}
                {tempScale === "metric" ? "°C" : "°F"}
              </Typography>
            </Box>

            {weatherData.weather.length > 0 && (
              <Box textAlign="center">
                <img
                  src={getWeatherIconSrc(weatherData.weather[0].icon)}
                  alt={weatherData.weather[0].description}
                />

                <Typography className="weatherCard-body">
                  {weatherData.weather[0].main}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>

      {onDelete && (
        <CardActions>
          <Button color="secondary" onClick={onDelete}>
            Delete
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

export default WeatherCard;
