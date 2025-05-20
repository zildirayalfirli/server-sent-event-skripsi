import React from 'react'
import HumidityStream from './component/humidityStream.jsx'
import SurfacePressureStream from './component/surfacepressureStream.jsx'
import TemperatureStream from './component/temperatureStream.jsx'
import TideHeightStream from './component/tideheightStream.jsx'
import WarningStream from './component/warningStream.jsx'
import WaveHeightStream from './component/waveheightStream.jsx'
import WeatherStream from './component/weatherStream.jsx'
import WindStream from './component/windStream.jsx'

const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🌤 Streaming Dashboard Via SSE</h1>
      {/* <HumidityStream /> */}
      <SurfacePressureStream />
      {/* <TemperatureStream /> */}
      <TideHeightStream />
      <WarningStream />
      <WaveHeightStream />
      <WeatherStream />
      <WindStream />
    </div>
  )
}

export default App
