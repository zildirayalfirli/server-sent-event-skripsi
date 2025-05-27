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

    clients.push({ res })

    req.on('close', () => {
        const index = clients.findIndex(c => c.res === res)
        if (index !== -1) {
            clients.splice(index, 1)
            console.log(`Client disconnected. Remaining clients: ${clients.length}`);
        }
    })
}

export const broadcast = () => {
    setInterval(async () => {
        const currentPid = process.pid;
        try {
            const [humidity, temperature, surfacePressure, tideHeight, warning, waveHeight, weather, wind] = await Promise.all([
                Humidity.find().limit(10),
                Temperature.find().limit(10),
                SurfacePressure.find().limit(10),
                TideHeight.find().limit(10),
                Warning.find().limit(10),
                WaveHeight.find().limit(10),
                Weather.find().limit(10),
                Wind.find().limit(10),
            ])

            const nowTimestamp = Date.now()

            const payloadData = {
            type: 'all',
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

            const activeClients = []
            clients.forEach(client => {
                try {
                    if (client.res.writableEnded === false) {
                        client.res.write(payload)
                        activeClients.push(client)
                    } else {
                    }
                } catch (error) {
                    console.error(`[Broadcast PID:${currentPid}] Error writing to client (likely disconnected): ${error.message}`);
                }
            })
            clients.splice(0, clients.length, ...activeClients);

            console.log(`📤 [PID ${process.pid}] Broadcasted to ${clients.length} clients at ${new Date(nowTimestamp).toISOString()}`);
        } catch (err) {
            console.error(`[Broadcast PID:${currentPid}] Error during broadcast cycle: ${err.message}`, err.stack);
            const errorPayload = `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
            clients.forEach(client => {
                try {
                    if (client.res.writableEnded === false) {
                        client.res.write(errorPayload)
                    }
                } catch (writeErr) {
                }
            })
        }
    }, 5000)
}