import type { OpenWeatherTempScale } from "./api";

export interface LocalStorageOptions {
  homeCity: string;
  tempScale: OpenWeatherTempScale;
  hasAutoOverlay: boolean;
}

const DEFAULT_OPTIONS: LocalStorageOptions = {
  homeCity: "",
  tempScale: "metric",
  hasAutoOverlay: false,
};

export async function getStoredCities(): Promise<string[]> {
  const result = await chrome.storage.local.get("cities");
  const cities: unknown = result.cities;

  if (
    Array.isArray(cities) &&
    cities.every((city) => typeof city === "string")
  ) {
    return cities;
  }

  return [];
}

export async function setStoredCities(cities: string[]): Promise<void> {
  await chrome.storage.local.set({ cities });
}

export async function getStoredOptions(): Promise<LocalStorageOptions> {
  const result = await chrome.storage.local.get("options");
  const options: unknown = result.options;

  if (
    typeof options === "object" &&
    options !== null &&
    !Array.isArray(options)
  ) {
    const storedOptions = options as Partial<LocalStorageOptions>;

    return {
      homeCity:
        typeof storedOptions.homeCity === "string"
          ? storedOptions.homeCity
          : DEFAULT_OPTIONS.homeCity,
      tempScale:
        storedOptions.tempScale === "metric" ||
        storedOptions.tempScale === "imperial"
          ? storedOptions.tempScale
          : DEFAULT_OPTIONS.tempScale,
      hasAutoOverlay:
        typeof storedOptions.hasAutoOverlay === "boolean"
          ? storedOptions.hasAutoOverlay
          : DEFAULT_OPTIONS.hasAutoOverlay,
    };
  }

  return { ...DEFAULT_OPTIONS };
}

export async function setStoredOptions(
  options: LocalStorageOptions,
): Promise<void> {
  await chrome.storage.local.set({ options });
}
