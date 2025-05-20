import Warning from '../models/warning.js'

const clients = []

export const streamWarning = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.write('retry: 10000\n\n')

  clients.push(res)
  console.log(`🟢 Warning client connected (${clients.length})`)

  req.on('close', () => {
    const index = clients.indexOf(res)
    if (index !== -1) clients.splice(index, 1)
    console.log(`🔴 Warning client disconnected (${clients.length})`)
    res.end()
  })
}

export const WarningBroadcast = () => {
  setInterval(async () => {
    try {
      const data = await Warning.find()
      const payload = `data: ${JSON.stringify(data)}\n\n`
      clients.forEach(client => client.write(payload))
    } catch (err) {
      const errorPayload = `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
      clients.forEach(client => client.write(errorPayload))
    }
  }, 5000)
}
