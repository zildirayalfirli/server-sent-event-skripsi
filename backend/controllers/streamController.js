import Humidity from '../models/humidity.js'
import Temperature from '../models/temperature.js'
import SurfacePressure from '../models/surfacePressure.js'
import TideHeight from '../models/tideHeight.js'
import Warning from '../models/warning.js'
import WaveHeight from '../models/waveHeight.js'
import Weather from '../models/weather.js'
import Wind from '../models/wind.js'

const clients = []

export const Stream = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.write('retry: 10000\n\n')

    clients.push(res)
    console.log(`🟢 client connected (${clients.length})`)

    req.on('close', () => {
    const index = clients.indexOf(res)
    if (index !== -1) clients.splice(index, 1)
    console.log(`🔴 client disconnected (${clients.length})`)
    res.end()
    })
}

export const broadcast = () => {
    setInterval(async () => {
        try {
        const [humidity, temperature, surfacePressure, tideHeight, warning, waveHeight, weather, wind] = await Promise.all([
            Humidity.find(),
            Temperature.find(),
            SurfacePressure.find(),
            TideHeight.find(),
            Warning.find(),
            WaveHeight.find(),
            Weather.find(),
            Wind.find(),
        ])

            const nowISO = new Date().toISOString();

            const payloadData = {
                sent_at: nowISO,
                humidity,
                temperature,
                surfacePressure,
                tideHeight,
                warning,
                waveHeight,
                weather,
                wind
            }

            const payload = `data: ${JSON.stringify(payloadData)}\n\n`
            clients.forEach(client => client.write(payload))
        } catch (err) {
            const errorPayload = `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
            clients.forEach(client => client.write(errorPayload))
        }
    }, 5000)
}
