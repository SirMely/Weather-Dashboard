import { useState } from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSpinner } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [city, setCity] = useState(""); // Stores user input
  const [weather, setWeather] = useState(null); // Stores weather data
  const [error, setError] = useState(null); // Stores error messages
  const [unit, setUnit] = useState("imperial"); // "imperial" for °F, "metric" for °C
  const [loading, setLoading] = useState(false); // Loading state

  // Function to capitalize each word in the weather description
  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Function to fetch weather data
  const fetchWeather = async (cityName = city, selectedUnit = unit) => {
    setError(null);
    setLoading(true); // Show loading modal immediately

    if (!cityName) {
      setError("Please enter a city name.");
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
          setError("City not found. Try again.");
          setLoading(false);
        }, 1000); // Force 3-second delay before showing the error
        return;
      }

      setTimeout(() => {
        setWeather({
          city: weatherData.name,
          temp: weatherData.main.temp,
          description: capitalizeWords(weatherData.weather[0].description),
          icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`,
        });
        setLoading(false); // Hide loading modal after 3 seconds
      }, 1000);

    } catch (err) {
      setTimeout(() => {
        setError("Failed to fetch data. Check your connection.");
        setLoading(false);
      }, 1000);
    }
  };


  // Function to toggle between °F and °C
  const toggleUnit = () => {
    const newUnit = unit === "imperial" ? "metric" : "imperial";
    setUnit(newUnit);

    if (weather) {
      fetchWeather(weather.city, newUnit);
    }
  };

  return (
    <main>

    <div className="app">
      {/* Loading Modal */}
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

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Current Weather */}
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

    <footer>
      <p>This website is getting active updates. &copy; Deontae Wills 2025</p>
    </footer>
    </main>
  );
}

export default App;
