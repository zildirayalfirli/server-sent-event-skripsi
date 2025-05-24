import React from 'react'
import Stream from './component/Stream.jsx'

const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🌤 Streaming Dashboard Via SSE</h1>
      <Stream />
    </div>
  )
}

export default App
