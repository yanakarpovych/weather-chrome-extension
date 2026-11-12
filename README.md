# Weather Chrome Extension

A Chrome extension built with React and TypeScript that allows users to track weather conditions in multiple cities.

## Features

- View current weather conditions for multiple cities
- Add and remove cities
- Display temperature, humidity, wind speed, and weather descriptions
- Switch between Celsius and Fahrenheit
- Save cities and preferences using Chrome Storage
- Set a home city
- Configure automatic weather overlay
- Display the home city's temperature on the extension badge
- Add cities through the browser context menu

## Technologies

- React 19
- TypeScript
- Material UI (MUI)
- Webpack 5
- Chrome Extensions Manifest V3
- Chrome Storage API
- Chrome Messaging API
- Chrome Alarms API
- OpenWeather API

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yanakarpovych/weather-chrome-extension.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API key

Create an API key at [OpenWeather](https://openweathermap.org/api).

Copy `src/utils/apiKey.example.ts` to `src/utils/apiKey.ts` and replace the placeholder with your API key.

The actual API key file is excluded from Git.

**Security note:** The API key is embedded in the compiled extension. Do not treat it as secret when distributing the build.

### 4. Build the extension

```bash
npm run typecheck
npm run build
```

### 5. Load into Chrome

1. Open `chrome://extensions/`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select the generated `dist` directory.

## Usage

Open the extension Popup to add cities and view current weather conditions.

Use the temperature button to switch between Celsius and Fahrenheit.

Open Extension options to configure your home city and automatic weather overlay.

On supported webpages, use the overlay button to toggle the weather card.

## Development

```bash
npm run start
```

Webpack watches source files and rebuilds the extension after changes. Reload the extension in Chrome to apply updates.

## Notes

- The extension requires an internet connection and a valid OpenWeather API key.
- Content scripts cannot run on Chrome internal pages.
- Weather data availability depends on the OpenWeather API.
- The overlay feature should be tested on regular HTTP or HTTPS websites.
