import { OPEN_WEATHER_API_KEY } from "./apiKey";

export interface OpenWeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
  wind: {
    deg: number;
    speed: number;
  };
}

export type OpenWeatherTempScale = "metric" | "imperial";

export async function fetchOpenWeatherData(
  city: string,
  tempScale: OpenWeatherTempScale = "metric",
): Promise<OpenWeatherData> {
  const params = new URLSearchParams({
    q: city,
    units: tempScale,
    appid: OPEN_WEATHER_API_KEY,
  });

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${params}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data (${response.status})`);
  }

  return response.json() as Promise<OpenWeatherData>;
}

export function getWeatherIconSrc(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
