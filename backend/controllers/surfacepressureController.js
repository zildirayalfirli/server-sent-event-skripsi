import SurfacePressure from '../models/surfacePressure.js'

const clients = []

export const streamSurfacePressure = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.write('retry: 10000\n\n')

  clients.push(res)
  console.log(`🟢 SurfacePressure client connected (${clients.length})`)

  req.on('close', () => {
    const index = clients.indexOf(res)
    if (index !== -1) clients.splice(index, 1)
    console.log(`🔴 SurfacePressure client disconnected (${clients.length})`)
    res.end()
  })
}

export const SurfacePressureBroadcast = () => {
  setInterval(async () => {
    try {
      const data = await SurfacePressure.find()
      const payload = `data: ${JSON.stringify(data)}\n\n`
      clients.forEach(client => client.write(payload))
    } catch (err) {
      const errorPayload = `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
      clients.forEach(client => client.write(errorPayload))
    }
  }, 5000)
}
