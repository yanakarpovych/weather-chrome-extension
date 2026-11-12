import {
  getStoredCities,
  getStoredOptions,
  setStoredCities,
} from "../utils/storage";
import { fetchOpenWeatherData } from "../utils/api";

const WEATHER_ALARM = "update-weather-badge";
const CONTEXT_MENU_ID = "add-weather-city";

async function updateWeatherBadge() {
  try {
    const options = await getStoredOptions();

    if (!options.homeCity.trim()) {
      await chrome.action.setBadgeText({ text: "" });
      return;
    }

    const weather = await fetchOpenWeatherData(
      options.homeCity,
      options.tempScale,
    );

    const temperature = Math.round(weather.main.temp);
    const symbol = options.tempScale === "metric" ? "°C" : "°F";

    await chrome.action.setBadgeBackgroundColor({
      color: "#1976d2",
    });

    await chrome.action.setBadgeText({
      text: `${temperature}${symbol}`,
    });
  } catch (error) {
    console.error("Failed to update weather badge:", error);
    await chrome.action.setBadgeText({ text: "" });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Add city to Weather Extension",
    contexts: ["selection"],
  });

  void chrome.alarms.create(WEATHER_ALARM, {
    periodInMinutes: 60,
  });

  void updateWeatherBadge();
});

chrome.runtime.onStartup.addListener(() => {
  void updateWeatherBadge();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === WEATHER_ALARM) {
    void updateWeatherBadge();
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.options) {
    void updateWeatherBadge();
  }
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  const city = info.selectionText?.trim();

  if (!city) return;

  void (async () => {
    try {
      const cities = await getStoredCities();

      const alreadyExists = cities.some(
        (existingCity) => existingCity.toLowerCase() === city.toLowerCase(),
      );

      if (!alreadyExists) {
        await setStoredCities([...cities, city]);
      }
    } catch (error) {
      console.error("Failed to add city:", error);
    }
  })();
});
