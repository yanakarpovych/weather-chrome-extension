import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import "@fontsource/roboto/400.css";

import {
  getStoredOptions,
  setStoredOptions,
  type LocalStorageOptions,
} from "../utils/storage";

import "./options.css";

function App() {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const storedOptions = await getStoredOptions();
        setOptions(storedOptions);
      } catch {
        setError("Failed to load settings.");
      }
    }

    loadOptions();
  }, []);

  async function handleSave() {
    if (!options) return;

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await setStoredOptions({
        ...options,
        homeCity: options.homeCity.trim(),
      });

      setMessage("Settings saved successfully.");
    } catch {
      setError("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!options) {
    return (
      <Box p={3}>
        <Typography>{error || "Loading settings..."}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", my: 5, px: 2 }}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h4">Weather Extension Options</Typography>

            <TextField
              fullWidth
              label="Home city"
              placeholder="Enter a home city name"
              value={options.homeCity}
              onChange={(event) =>
                setOptions({
                  ...options,
                  homeCity: event.target.value,
                })
              }
              disabled={isSaving}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={options.hasAutoOverlay}
                  onChange={(_, checked) =>
                    setOptions({
                      ...options,
                      hasAutoOverlay: checked,
                    })
                  }
                  disabled={isSaving}
                />
              }
              label="Automatically show weather overlay on webpage load"
            />

            <Box>
              <Button
                variant="contained"
                onClick={() => void handleSave()}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </Box>

            {message && <Alert severity="success">{message}</Alert>}

            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

const root = document.createElement("div");
document.body.appendChild(root);

createRoot(root).render(<App />);
