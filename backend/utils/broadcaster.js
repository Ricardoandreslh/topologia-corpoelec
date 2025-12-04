const wsClients = new Set();

function registerClient(ws) {
  wsClients.add(ws);
  ws.on('close', () => wsClients.delete(ws));
}

function broadcast(obj) {
  try {
    const payload = JSON.stringify(obj);
    for (const ws of wsClients) {
      try {
        if (ws.readyState === ws.OPEN) ws.send(payload);
      } catch (e) {
        console.warn('WS send failed', e);
      }
    }
  } catch (e) {
    console.error('Broadcast error', e);
  }
}

module.exports = { registerClient, broadcast };