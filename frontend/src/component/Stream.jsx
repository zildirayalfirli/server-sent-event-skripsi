import React, { useEffect, useState } from 'react'

const Stream = () => {
    const [data, setData] = useState({
        humidity: [],
        temperature: [],
        surfacePressure: [],
        tideHeight: [],
        warning: [],
        waveHeight: [],
        weather: [],
        wind: [],
    })

    useEffect(() => {
        const eventSource = new EventSource(`${import.meta.env.VITE_API_SERVER_SSE}`)

        eventSource.onmessage = (event) => {
        const parsed = JSON.parse(event.data)
        setData(parsed)
        }

        eventSource.onerror = (err) => {
        console.error('SSE error:', err)
        eventSource.close()
        }

        return () => eventSource.close()
    }, [])

  return (
    <div>
        <h2>💧 Humidity Streams</h2>
        <ul>
            {data.humidity?.slice(0, 10).map((item, i) => (
            <li key={i}>
              {new Date(item.Datetime).toLocaleString()} — {item.Air_Humidity} %
            </li>
            ))}
        </ul>

        <h2>🌡 Temperature Streams</h2>
        <ul>
            {data.temperature?.slice(0, 10).map((item, i) => (
            <li key={i}>
              {new Date(item.Datetime).toLocaleString()} — {item.Temperature} °C
            </li>
            ))}
        </ul>

        <h2>📉 Surface Pressure Streams</h2>
        <ul>
            {data.surfacePressure?.slice(0, 10).map((item, i) => (
            <li key={i}>
              {new Date(item.Datetime).toLocaleString()} — {item.Surface_Pressure} hPa
            </li>
            ))}
        </ul>

        <h2>🌊 Tide Height Streams</h2>
        <ul>
            {data.tideHeight?.slice(0, 10).map((item, i) => (
            <li key={i}>
              {new Date(item.Datetime).toLocaleString()} — {item.Tide_Height} m
            </li>
            ))}
        </ul>

        <h2>⚠️ Warning Streams</h2>
        <ul>
        {data.warning?.slice(0, 10).map((item, i) => (
          <li key={i}>
            {new Date(item.Datetime).toLocaleString()} — {item.Warning_Desc}
          </li>
        ))}
        </ul>

        <h2>🌊 Wave Height Streams</h2>
        <ul>
        {data.waveHeight?.slice(0, 10).map((item, i) => (
          <li key={i}>
            {new Date(item.Datetime).toLocaleString()} — Ketinggian Gelombang : {item.Wave_Height}, Kategori Gelombang : {item.Wave_Category}
          </li>
        ))}
        </ul>

        <h2>🌦 Weather Streams</h2>
        <ul>
        {data.weather?.slice(0, 10).map((item, i) => (
        <li key={i}>
            {new Date(item.Datetime).toLocaleString()} — Cuaca : {item.Weathers_Category}
        </li>
        ))}
        </ul>

        <h2>💨 Wind Streams</h2>
        <ul>
        {data.wind?.slice(0, 10).map((item, i) => (
          <li key={i}>
            {new Date(item.Datetime).toLocaleString()} — Kecepatan Angin : {item.Wind_Speed} m/s, Arah Asal Angin : {item.Wind_From}, Arah Tujuan Angin : {item.Wind_To}, Derajat Arah Angin : {item.Degrees_Wind}°
          </li>
        ))}
        </ul>
    </div>
  )
}

export default Stream
