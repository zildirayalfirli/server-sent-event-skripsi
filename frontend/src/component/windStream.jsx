import React, { useEffect, useState } from 'react'

const WindStream = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_SERVER_SSE || ''
    const eventSource = new EventSource(`${baseUrl}/wind-stream`)

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        setData(parsed)
      } catch (err) {
        console.error('❌ JSON parse error:', err)
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE error (wind):', err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div>
      <h2>💨 Wind Streams</h2>
      <ul>
        {data.slice(0, 10).map((item, index) => (
          <li key={index}>
            {new Date(item.Datetime).toLocaleString()} — Kecepatan Angin : {item.Wind_Speed} m/s, Arah Asal Angin : {item.Wind_From}, Arah Tujuan Angin : {item.Wind_To}, Derajat Arah Angin : {item.Degrees_Wind}°
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WindStream
