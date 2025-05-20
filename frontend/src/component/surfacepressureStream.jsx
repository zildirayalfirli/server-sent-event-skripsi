import React, { useEffect, useState } from 'react'

const SurfacePressureStream = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_SERVER_SSE || ''
    const eventSource = new EventSource(`${baseUrl}/surfacepressure-stream`)

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        setData(parsed)
      } catch (err) {
        console.error('❌ JSON parse error:', err)
      }
    }
    
    eventSource.onerror = (err) => {
      console.error('SSE error (surface pressure):', err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div>
      <h2>📉 Surface Pressure Streams</h2>
      <ul>
        {data.slice(0, 10).map((item, index) => (
          <li key={index}>
            {new Date(item.Datetime).toLocaleString()} — {item.Surface_Pressure} hPa
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SurfacePressureStream