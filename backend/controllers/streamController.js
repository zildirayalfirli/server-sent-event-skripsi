import Humidity from '../models/humidity.js';
import Temperature from '../models/temperature.js';
import SurfacePressure from '../models/surfacePressure.js';
import TideHeight from '../models/tideHeight.js';
import Warning from '../models/warning.js';
import WaveHeight from '../models/waveHeight.js';
import Weather from '../models/weather.js';
import Wind from '../models/wind.js';

const clients = [];

export const Stream = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Content-Encoding', 'identity');
  res.flushHeaders?.();
  res.write('retry: 10000\n\n');

  const client = { res };
  clients.push(client);

  res.write(': connected\n\n');

  req.on('close', () => {
    const index = clients.indexOf(client);
    if (index !== -1) clients.splice(index, 1);
    console.log(`❌ Client disconnected. Remaining: ${clients.length}`);
  });
};

setInterval(() => {
  for (const client of clients) {
    try {
      client.res.write(': keep-alive\n\n');
    } catch (err) {}
  }
}, 15000);

export const broadcast = () => {
  setInterval(async () => {
    if (clients.length === 0) return;

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
        ]);

      const now = Date.now();
      const payload = {
        type: 'all',
        sent_at: now,
        humidity,
        temperature,
        surfacePressure,
        tideHeight,
        warning,
        waveHeight,
        weather,
        wind
      };

      const stringPayload = `data: ${JSON.stringify(payload)}\n\n`;

    for (const client of [...clients]) {
        try {
          if (!client.res.writableEnded) {
            client.res.write(stringPayload);
          }
        } catch (err) {
          console.warn(`[SSE] Failed to write to client: ${err.message}`);
        }
      }


      console.log(`📤 [PID ${currentPid}] Broadcast to ${clients.length} clients at ${new Date(now).toISOString()}`);
    } catch (err) {
      console.error(`[Broadcast PID:${process.pid}] ❌ Error during broadcast: ${err.message}`);
      const errorPayload = `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`;
      for (const client of clients) {
        try {
          if (!client.res.writableEnded) {
            client.res.write(errorPayload);
          }
        } catch {}
      }
    }
  }, 5000);
};