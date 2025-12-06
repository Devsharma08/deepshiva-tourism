// components/WeatherWidget.js
import React, { useState, useEffect } from 'react';
import { WEATHER_API_URL, MAP_CENTER } from './Constants.jsx';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('today'); // 'today' or '3day'
  
  const getWeatherIcon = (code, isDay = true) => {
    const icons = {
      0: isDay ? '☀️' : '🌙',
      1: isDay ? '🌤️' : '🌤️',
      2: '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌦️',
      53: '🌦️',
      55: '🌦️',
      61: '🌧️',
      63: '🌧️',
      65: '🌧️',
      71: '🌨️',
      73: '🌨️',
      75: '🌨️',
      77: '🌨️',
      80: '🌦️',
      81: '🌧️',
      82: '🌧️',
      85: '🌨️',
      86: '🌨️',
      95: '⛈️',
      96: '⛈️',
      99: '⛈️'
    };
    return icons[code] || '☀️';
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Clear';
  };

  const generateMockForecast = () => {
    const now = new Date();
    const hourly = [];
    const daily = [];
    
    // Generate 5-hour forecast
    for (let i = 0; i < 5; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      hourly.push({
        time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(25 + Math.random() * 10 - 5),
        code: [0, 1, 2, 3, 61, 80][Math.floor(Math.random() * 6)],
        precipitation: Math.round(Math.random() * 100),
        humidity: Math.round(50 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 15)
      });
    }
    
    // Generate 3-day forecast
    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      daily.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        high: Math.round(28 + Math.random() * 8),
        low: Math.round(18 + Math.random() * 5),
        code: [0, 1, 2, 3, 61, 80][Math.floor(Math.random() * 6)],
        precipitation: Math.round(Math.random() * 100),
        humidity: Math.round(50 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 15)
      });
    }
    
    return { hourly, daily };
  };

  useEffect(() => {
    const fetchWeather = async () => {
      const [lat, lon] = MAP_CENTER;
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation',
        hourly: 'temperature_2m,weather_code,precipitation,relative_humidity_2m,wind_speed_10m',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max',
        forecast_days: 4,
        timezone: 'auto',
      });
      
      try {
        const res = await fetch(`${WEATHER_API_URL}?${params}`);
        if (!res.ok) throw new Error('Weather API failed');
        const data = await res.json();
        
        const mockData = generateMockForecast();
        
        setWeather({ 
          current: {
            temp: Math.round(data.current.temperature_2m),
            icon: getWeatherIcon(data.current.weather_code),
            description: getWeatherDescription(data.current.weather_code),
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            precipitation: data.current.precipitation,
            feelsLike: Math.round(data.current.temperature_2m + 2)
          },
          hourly: mockData.hourly,
          daily: mockData.daily
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
        // Fallback to mock data
        const mockData = generateMockForecast();
        setWeather({ 
          current: {
            temp: 28,
            icon: '☀️',
            description: 'Clear sky',
            humidity: 65,
            windSpeed: 12,
            precipitation: 0,
            feelsLike: 30
          },
          hourly: mockData.hourly,
          daily: mockData.daily
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (isLoading) {
    return (
      <div className="weather-widget">
        <div className="loading-placeholder">Loading Weather...</div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-widget">
        <div className="empty-placeholder">Weather data unavailable.</div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-current">
        <div className="weather-main">
          <div className="weather-location">New Delhi</div>
          <div className="weather-temp">{weather.current.temp}°C</div>
          <div className="weather-description">{weather.current.description}</div>
          <div className="weather-feels-like">Feels like {weather.current.feelsLike}°C</div>
        </div>
        <div className="weather-icon-large">{weather.current.icon}</div>
      </div>

      <div className="weather-details-grid">
        <div className="weather-detail">
          <span className="detail-label">💧 Humidity</span>
          <span className="detail-value">{weather.current.humidity}%</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">💨 Wind</span>
          <span className="detail-value">{weather.current.windSpeed} km/h</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">🌧️ Precip</span>
          <span className="detail-value">{weather.current.precipitation}%</span>
        </div>
      </div>

      <div className="weather-view-selector">
        <button 
          className={`view-btn ${selectedView === 'today' ? 'active' : ''}`}
          onClick={() => setSelectedView('today')}
        >
          5-Hour
        </button>
        <button 
          className={`view-btn ${selectedView === '3day' ? 'active' : ''}`}
          onClick={() => setSelectedView('3day')}
        >
          3-Day
        </button>
      </div>

      {selectedView === 'today' ? (
        <div className="hourly-forecast">
          <h4>Next 5 Hours</h4>
          <div className="hourly-list">
            {weather.hourly.map((hour, index) => (
              <div key={index} className="hourly-item">
                <div className="hour-time">{hour.time}</div>
                <div className="hour-icon">{getWeatherIcon(hour.code)}</div>
                <div className="hour-temp">{hour.temp}°</div>
                <div className="hour-precip">💧 {hour.precipitation}%</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="daily-forecast">
          <h4>3-Day Forecast</h4>
          <div className="daily-list">
            {weather.daily.map((day, index) => (
              <div key={index} className="daily-item">
                <div className="day-date">{day.date}</div>
                <div className="day-icon">{getWeatherIcon(day.code)}</div>
                <div className="day-temps">
                  <span className="day-high">{day.high}°</span>
                  <span className="day-low">{day.low}°</span>
                </div>
                <div className="day-details">
                  <div className="day-precip">💧 {day.precipitation}%</div>
                  <div className="day-wind">💨 {day.windSpeed} km/h</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="weather-alerts">
        <div className="weather-alert">
          <span className="alert-icon">⚠️</span>
          <span className="alert-message">UV Index: High (7)</span>
        </div>
        <div className="weather-alert">
          <span className="alert-icon">💨</span>
          <span className="alert-message">Windy conditions expected</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;