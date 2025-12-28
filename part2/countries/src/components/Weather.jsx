import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    if (!capital) return

    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              q: capital,
              units: 'metric',
              appid: apiKey
            }
          }
        )
        setWeather(response.data)
      } catch (error) {
        console.error('Error fetching weather:', error)
      }
    }

    fetchWeather()
  }, [capital, apiKey])

  if (!weather) return <div>Loading weather...</div>

  const iconCode = weather.weather[0].icon
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <div>Temperature {weather.main.temp.toFixed(2)} °C</div>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <div>Wind {weather.wind.speed} m/s</div>
    </div>
  )
}

export default Weather