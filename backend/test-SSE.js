const EventSource = require('eventsource');

const TOTAL_CLIENTS = 100;
const URL = 'http://localhost:3001/sse';

let totalEvents = 0;
let firstLatencies = [];
let firstResponseTimes = [];
let startTimes = Array(TOTAL_CLIENTS).fill(0);
let messageCounts = Array(TOTAL_CLIENTS).fill(0);

console.log(`🚀 Starting ${TOTAL_CLIENTS} SSE clients...`);

for (let i = 0; i < TOTAL_CLIENTS; i++) {
  const es = new EventSource(URL);

  es.onopen = () => {
    startTimes[i] = Date.now();
  };

  es.onmessage = (e) => {
    try {
      const now = Date.now();
      const data = JSON.parse(e.data);
      const sent = new Date(data.sent_at).getTime();
      const latency = now - sent;

      messageCounts[i]++;
      totalEvents++;

      if (messageCounts[i] === 1) {
        const responseTime = now - startTimes[i];
        firstLatencies.push(latency);
        firstResponseTimes.push(responseTime);
        console.log(`[Client ${i}] Latency: ${latency}ms | Response Time: ${responseTime}ms`);
      }
    } catch (err) {
      console.error(`JSON error (client ${i}):`, err.message);
    }
  };

  es.onerror = (err) => {
    console.error(`[Client ${i}] Connection error:`, err.message);
    es.close();
  };
}

setTimeout(() => {
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length || 0;
  console.log('\n📊 === SUMMARY ===');
  console.log(`👥 Clients         : ${TOTAL_CLIENTS}`);
  console.log(`📨 Total Events    : ${totalEvents}`);
  console.log(`⏱️ Avg Latency     : ${avg(firstLatencies).toFixed(2)} ms`);
  console.log(`⏱️ Avg Response    : ${avg(firstResponseTimes).toFixed(2)} ms`);
  console.log(`⚡ Throughput       : ${(totalEvents / 30).toFixed(2)} msg/sec`);
  process.exit(0);
}, 30000);

