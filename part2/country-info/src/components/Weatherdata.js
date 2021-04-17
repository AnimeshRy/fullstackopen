import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FetchData = (country, apiKey) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      const response = await axios.get(
        `http://api.weatherstack.com/current?access_key=${apiKey}&query=${country}`
      );
      setWeather(response.data.current);
      setLoading(false);
    };
    fetchWeather();
  }, [country, apiKey]);

  return { loading, weather };
};

const Weatherdata = ({ country }) => {
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const { loading, weather } = FetchData(country, apiKey);
  return (
    <div>
      <h3>Weather in {country}</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>
            <b>Temperature</b> - {weather.temperature} Celcius{' '}
          </p>
          <img
            src={weather.weather_icons[0]}
            alt="weather-img"
            width="100px"
            height="100px"
          />
          <br />
          <p>{weather.weather_descriptions[0]}</p>
          <p>
            Wind - {weather.wind_speed} {weather.wind_dir}
          </p>{' '}
        </div>
      )}
    </div>
  );
};

export default Weatherdata;
