import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db/mongodb.js'
import humidityRoute from './routes/humidityRoute.js'
import surfacepressureRoute from './routes/surfacepressureRoute.js'
import temperatureRoute from './routes/temperatureRoute.js'
import tideheightRoute from './routes/tideheightRoute.js'
import warningRoute from './routes/warningRoute.js'
import waveheightRoute from './routes/waveheightRoute.js'
import weatherRoute from './routes/weatherRoute.js'
import windRoute from './routes/windRoute.js'
import { SurfacePressureBroadcast } from './controllers/surfacepressureController.js'
import { HumidityBroadcast } from './controllers/humidityController.js'
import { TemperatureBroadcast } from './controllers/temperatureController.js'
import { TideHeightBroadcast } from './controllers/tideheightController.js'
import { WarningBroadcast } from './controllers/warningController.js'
import { WaveHeightBroadcast } from './controllers/waveheightController.js'
import { WeatherBroadcast } from './controllers/weatherController.js'
import { WindBroadcast } from './controllers/windController.js'
import streamRoute from './routes/streamRoute.js'
import { broadcast } from './controllers/streamController.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 9000

app.use(cors())
app.use(express.json())

// app.use('/api', humidityRoute)
// app.use('/api', surfacepressureRoute)
// app.use('/api', temperatureRoute)
// app.use('/api', tideheightRoute)
// app.use('/api', warningRoute)
// app.use('/api', waveheightRoute)
// app.use('/api', weatherRoute)
// app.use('/api', windRoute)
app.use('/', streamRoute)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
  })
  // SurfacePressureBroadcast()
  // HumidityBroadcast()
  // TemperatureBroadcast()
  // TideHeightBroadcast()
  // WarningBroadcast()
  // WaveHeightBroadcast()
  // WeatherBroadcast()
  // WindBroadcast()
  broadcast()
})