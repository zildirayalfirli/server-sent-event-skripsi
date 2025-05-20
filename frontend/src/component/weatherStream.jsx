import React, { useEffect, useState } from 'react'

const WeatherStream = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_SERVER_SSE || ''
    const eventSource = new EventSource(`${baseUrl}/weather-stream`)

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        setData(parsed)
      } catch (err) {
        console.error('❌ JSON parse error:', err)
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE error (weather):', err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div>
      <h2>🌦 Weather Streams</h2>
      <ul>
        {data.slice(0, 10).map((item, index) => (
          <li key={index}>
            {new Date(item.Datetime).toLocaleString()} — Cuaca : {item.Weathers_Category}, Kelembapan Udara : {item.Air_Humidity} %, Suhu : {item.Temperature} °C
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WeatherStream