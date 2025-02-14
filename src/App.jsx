import { useState } from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSpinner } from "@fortawesome/free-solid-svg-icons";

/**
 * Weather Dashboard App
 * 
 * This React app lets you search for a city and get the latest weather info.
 * - Uses OpenWeather API to pull real-time data.
 * - Shows current temp, weather description, and an icon.
 * - Lets you switch between Fahrenheit (°F) and Celsius (°C).
 * - Shows a loading spinner while fetching data.
 * 
 * @component
 */
function App() {
  // **State Hooks (React be remembering these)**
  const [city, setCity] = useState(""); // Stores whatever city the user types
  const [weather, setWeather] = useState(null); // Holds the weather data
  const [error, setError] = useState(null); // Holds error messages
  const [unit, setUnit] = useState("imperial"); // "imperial" = °F, "metric" = °C
  const [loading, setLoading] = useState(false); // Tells us when data is loading

  /**
   * Capitalizes each word in the weather description. 
   * Basically makes "light rain" look like "Light Rain".
   * @param {string} str - Weather description (ex: "light rain")
   * @returns {string} Capitalized description (ex: "Light Rain")
   */
  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  /**
   * Fetches weather data for the given city.
   * @param {string} [cityName=city] - Name of the city to get weather for.
   * @param {string} [selectedUnit=unit] - "imperial" for °F, "metric" for °C.
   * @returns {void} Updates state with weather data or error message.
   */
  const fetchWeather = async (cityName = city, selectedUnit = unit) => {
    setError(null);
    setLoading(true); // Show that loading modal

    if (!cityName) {
      setError("Yo, type in a city first.");
      setLoading(false);
      return;
    }

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${selectedUnit}`;

    try {
      const weatherRes = await fetch(currentWeatherURL);
      const weatherData = await weatherRes.json();

      if (weatherData.cod !== 200) {
        setTimeout(() => {
          setError("Ayo, that city don’t exist. Try again.");
          setLoading(false);
        }, 1000); // Simulated delay for dramatic effect
        return;
      }

      setTimeout(() => {
        setWeather({
          city: weatherData.name,
          temp: weatherData.main.temp,
          description: capitalizeWords(weatherData.weather[0].description),
          icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`,
        });
        setLoading(false);
      }, 1000);

    } catch (err) {
      setTimeout(() => {
        setError("Couldn't fetch data. Might be your internet, idk.");
        setLoading(false);
      }, 1000);
    }
  };

  /**
   * Toggles the temperature unit (°F <-> °C) and fetches new data.
   */
  const toggleUnit = () => {
    const newUnit = unit === "imperial" ? "metric" : "imperial";
    setUnit(newUnit);

    if (weather) {
      fetchWeather(weather.city, newUnit);
    }
  };

  return (
    <main>
      {/* Main App Container */}
      <div className="app">

        {/* Loading Modal (Shows while fetching data) */}
        {loading && (
          <div className="loading-modal">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p>Loading Weather...</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={() => fetchWeather(city, unit)}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          </button>
        </div>

        {/* Error Message (if something goes wrong) */}
        {error && <p className="error">{error}</p>}

        {/* Weather Info Display */}
        {weather && (
          <div className="weather-info">
            <img src={weather.icon} alt="Weather Icon" />
            <p>{weather.temp}°{unit === "imperial" ? "F" : "C"}</p>
            <h2>{weather.city}</h2>
            <p>Weather: {weather.description}</p>
            <button className="toggle-btn" onClick={toggleUnit}>
              Switch to {unit === "imperial" ? "°C" : "°F"}
            </button>
          </div>
        )}
      </div>

      {/* Footer (Because every site needs one) */}
      <footer>
        <p>Deontae Wills 2025 &copy; This app is currently in active development</p>
      </footer>
    </main>
  );
}

export default App;
