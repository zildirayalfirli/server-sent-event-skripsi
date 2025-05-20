import Humidity from '../models/humidity.js'

const clients = []

export const streamHumidity = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.write('retry: 10000\n\n')

  clients.push(res)
  console.log(`🟢 Humidity client connected (${clients.length})`)

  req.on('close', () => {
    const index = clients.indexOf(res)
    if (index !== -1) clients.splice(index, 1)
    console.log(`🔴 Humidity client disconnected (${clients.length})`)
    res.end()
  })
}

export const HumidityBroadcast = () => {
  setInterval(async () => {
    try {
      const data = await Humidity.find()
      const payload = `data: ${JSON.stringify(data)}\n\n`
      clients.forEach(client => client.write(payload))
    } catch (err) {
      const errorPayload = `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
      clients.forEach(client => client.write(errorPayload))
    }
  }, 5000)
}
