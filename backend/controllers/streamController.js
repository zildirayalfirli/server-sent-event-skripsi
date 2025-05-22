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

    let timeoutId = setTimeout(() => {
        res.end()
    }, 30000)

    clients.push({ res, timeoutId })

    req.on('close', () => {
        const index = clients.findIndex(c => c.res === res)
        if (index !== -1) {
            clearTimeout(clients[index].timeoutId)
            clients.splice(index, 1)
        }
        res.end()
    })
}

export const broadcast = () => {
    setInterval(async () => {
        try {
            const [humidity, temperature, surfacePressure, tideHeight, warning, waveHeight, weather, wind] = await Promise.all([
                Humidity.find().sort({ Timestamp: -1 }).limit(10),
                Temperature.find().sort({ Timestamp: -1 }).limit(10),
                SurfacePressure.find().sort({ Timestamp: -1 }).limit(10),
                TideHeight.find().sort({ Timestamp: -1 }).limit(10),
                Warning.find().sort({ Timestamp: -1 }).limit(10),
                WaveHeight.find().sort({ Timestamp: -1 }).limit(10),
                Weather.find().sort({ Timestamp: -1 }).limit(10),
                Wind.find().sort({ Timestamp: -1 }).limit(10),
            ])

            const nowTimestamp = Date.now()

            const payloadData = {
                sent_at: nowTimestamp,
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

            clients.forEach(client => {
                client.res.write(payload)

                clearTimeout(client.timeoutId)
                client.timeoutId = setTimeout(() => {
                    client.res.end()
                }, 30000)
            })

        console.log(`📡 Broadcast completed at ${new Date(nowTimestamp).toISOString()} to ${clients.length} clients`)
        } catch (err) {
            const errorPayload = `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
            clients.forEach(client => client.res.write(errorPayload))
        }
    }, 5000)
}
