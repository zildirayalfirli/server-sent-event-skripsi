import React, { useEffect, useState } from 'react'

const WarningStream = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_SERVER_SSE || ''
    const eventSource = new EventSource(`${baseUrl}/warning-stream`)

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        setData(parsed)
      } catch (err) {
        console.error('❌ JSON parse error:', err)
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE error (warning):', err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div>
      <h2>⚠️ Warning Streams</h2>
      <ul>
        {data.slice(0, 10).map((item, index) => (
          <li key={index}>
            {new Date(item.Datetime).toLocaleString()} — {item.Warning_Desc}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WarningStream