import React, { useEffect, useState } from 'react'

const WaveHeightStream = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_SERVER_SSE || ''
    const eventSource = new EventSource(`${baseUrl}/waveheight-stream`)

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        setData(parsed)
      } catch (err) {
        console.error('❌ JSON parse error:', err)
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE error (wave height):', err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div>
      <h2>🌊 Wave Height Streams</h2>
      <ul>
        {data.slice(0, 10).map((item, index) => (
          <li key={index}>
            {new Date(item.Datetime).toLocaleString()} — Ketinggian Gelombang : {item.Wave_Height}, Kategori Gelombang : {item.Wave_Category}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WaveHeightStream